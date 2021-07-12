import express from 'express'
import { SignUpUseCase as UseCase } from './SignUpUseCase'
import { SignUpRequestDto as RequestDto } from './SignUpDto'
import { SignUpErrors as Errors } from './SignUpErrors'
import { BaseController } from '../../../../shared/infra/http/models'
import { TextUtils } from '../../../../shared/utils'

class SignUpController extends BaseController {
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
      role: TextUtils.sanitize(dto.role),
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
        return this.accepted(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}

export { SignUpController }
