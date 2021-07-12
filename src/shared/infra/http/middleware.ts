import express from 'express'
import { last, pipe, split } from 'ramda'
import SwaggerUI from 'swagger-ui-express'
import openApiDoc from '../../../../docs/api.json'
import { httpStatusCode } from './utils/httpStatusCode'
import { ExpressRequestWithAuthenticatedUser } from './models'
import { Role } from '../../../modules/users/domain/models'
import { IAuthService, JwtService } from '../../domain/services'
import { userRepo } from '../repos'

const createMiddleware = (authService: IAuthService) => {
  const openApi = {
    serve: SwaggerUI.serveWithOptions({ redirect: false }),
    setup: SwaggerUI.setup(openApiDoc),
  }

  const authorize =
    (role?: Role) =>
    async (
      req: ExpressRequestWithAuthenticatedUser,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const bearerToken = req.headers['authorization']

      if (!bearerToken) {
        return res
          .status(httpStatusCode.unauthorized.code)
          .send({ message: 'Unauthorized' })
      }

      const splitBySpaceAndGetLastArrayItem = pipe(split(' '), last)
      const jwt = splitBySpaceAndGetLastArrayItem(bearerToken) as string
      const decodedPayload = await authService.verifyToken(jwt)
      const signatureFailed = !decodedPayload

      if (signatureFailed) {
        return res
          .status(httpStatusCode.unauthorized.code)
          .send({ message: 'Unauthorized' })
      }

      const authenticatedUser = decodedPayload

      const userIdTakenFromToken = decodedPayload._id
      const userRoleTakenFromToken = decodedPayload.role
      const userCurrentData = await userRepo.findById(userIdTakenFromToken)

      const userRoleHasChanged = userRoleTakenFromToken !== userCurrentData.role
      if (userRoleHasChanged) {
        return res
          .status(httpStatusCode.unauthorized.code)
          .send({ message: 'Unauthorized' })
      }

      if (!!role && authenticatedUser.role !== role) {
        return res
          .status(httpStatusCode.forbidden.code)
          .send({ message: 'Forbidden' })
      }

      req.authenticatedUser = authenticatedUser

      return next()
    }

  return {
    openApi,
    authorize,
  }
}

const middleware = createMiddleware(new JwtService())

export { middleware }
