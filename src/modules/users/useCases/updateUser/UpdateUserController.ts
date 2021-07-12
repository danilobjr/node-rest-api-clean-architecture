import express from 'express'
import { UpdateUserUseCase as UseCase } from './UpdateUserUseCase'
import { UpdateUserRequestDto as RequestDto } from './UpdateUserDto'
import { UpdateUserErrors as Errors } from './UpdateUserErrors'
import {
  BaseController,
  ExpressRequestWithAuthenticatedUser,
} from '../../../../shared/infra/http/models'
import { TextUtils } from '../../../../shared/utils'

class UpdateUserController extends BaseController {
  constructor(private useCase: UseCase) {
    super()
  }

  async executeImpl(
    req: ExpressRequestWithAuthenticatedUser,
    res: express.Response,
  ): Promise<unknown> {
    let dto: RequestDto = req.body

    dto = {
      authenticatedUser: req.authenticatedUser,
      _id: TextUtils.sanitize(req.params._id),
      name: TextUtils.sanitize(dto.name),
      gender: TextUtils.sanitize(dto.gender),
      birthday: TextUtils.sanitize(dto.birthday),
      cpf: TextUtils.sanitize(dto.cpf),
      cellphone: TextUtils.sanitize(dto.cellphone),
      email: TextUtils.sanitize(dto.email),
      addressZipCode: TextUtils.sanitize(dto.addressZipCode),
    }

    try {
      const maybeErrorOrCorrectResponse = await this.useCase.execute(dto)

      if (maybeErrorOrCorrectResponse.isLeft()) {
        const error = maybeErrorOrCorrectResponse.value

        switch (error.constructor) {
          case Errors.ValidationError:
            return this.badRequest(res, error?.errorValue?.message)
          case Errors.NotFoundUserError:
            return this.notFound(res, error?.errorValue?.message)
          case Errors.UniqueUserError:
            return this.conflict(res, error?.errorValue?.message)
          case Errors.ForbiddenError:
            return this.forbidden(res, error?.errorValue?.message)
          default:
            return this.fail(res, error?.errorValue?.message)
        }
      } else {
        const responseResult = maybeErrorOrCorrectResponse.value
        return this.ok(res, responseResult.value)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}

export { UpdateUserController }
