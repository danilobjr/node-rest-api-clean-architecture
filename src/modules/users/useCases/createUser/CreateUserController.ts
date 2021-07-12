import express from 'express'
import { CreateUserUseCase as UseCase } from './CreateUserUseCase'
import { CreateUserRequestDto as RequestDto } from './CreateUserDto'
import { CreateUserErrors as Errors } from './CreateUserErrors'
import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { TextUtils } from '../../../../../shared/utils/TextUtils'

class CreateUserController extends BaseController {
  constructor(private useCase: UseCase) {
    super()
  }

  async executeImpl(
    req: express.Request,
    res: express.Response,
  ): Promise<unknown> {
    let dto: RequestDto = req.body

    dto = {
      name: TextUtils.sanitize(dto.name),
      birthday: dto.birthday,
      gender: TextUtils.sanitize(dto.gender),
      cpf: TextUtils.sanitize(dto.cpf),
      cellphone: TextUtils.sanitize(dto.cellphone),
      email: TextUtils.sanitize(dto.email),
      zipCode: TextUtils.sanitize(dto.zipCode),
      password: dto.password,
      passwordConfirmation: dto.passwordConfirmation,
    }

    try {
      const maybeErrorOrCorrectResponse = await this.useCase.execute(dto)

      if (maybeErrorOrCorrectResponse.isLeft()) {
        const error = maybeErrorOrCorrectResponse.value

        switch (error.constructor) {
          case Errors.ValidationError:
            return this.badRequest(res, error?.errorValue?.message)
          case Errors.UniqueUserError:
            return this.conflict(res, error?.errorValue?.message)
          default:
            return this.fail(res, error?.errorValue?.message)
        }
      } else {
        const responseResult = maybeErrorOrCorrectResponse.value
        return this.created(res, responseResult.value)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}

export { CreateUserController }
