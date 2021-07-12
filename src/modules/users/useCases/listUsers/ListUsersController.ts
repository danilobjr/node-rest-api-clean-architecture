import express from 'express'
import { ListUsersUseCase as UseCase } from './ListUsersUseCase'
import { ListUsersRequestDto as RequestDto } from './ListUsersDto'
import { BaseController } from '../../../../shared/infra/http/models'
import { TextUtils } from '../../../../shared/utils'

class ListUsersController extends BaseController {
  constructor(private useCase: UseCase) {
    super()
  }

  async executeImpl(
    req: express.Request,
    res: express.Response,
  ): Promise<unknown> {
    try {
      const dto: RequestDto = {
        searchTerm: TextUtils.sanitize(req.query?.searchTerm as string),
        skip: TextUtils.sanitize(req.query?.skip as string),
        limit: TextUtils.sanitize(req.query?.limit as string),
        sortBy: TextUtils.sanitize(req.query?.sortBy as string),
        ordering: TextUtils.sanitize(req.query?.ordering as string),
      }

      const maybeErrorOrCorrectResponse = await this.useCase.execute(dto)

      if (maybeErrorOrCorrectResponse.isLeft()) {
        const error = maybeErrorOrCorrectResponse.value
        return this.fail(res, error?.errorValue?.message)
      } else {
        const responseResult = maybeErrorOrCorrectResponse.value
        return this.ok(res, responseResult.value)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}

export { ListUsersController }
