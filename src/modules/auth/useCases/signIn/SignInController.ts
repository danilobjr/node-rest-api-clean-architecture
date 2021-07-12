import express from 'express'
import { BaseController } from '../../../../shared/infra/http/models'
import { SignInUseCase } from './SignInUseCase'
import { SignInDtoRequest, SignInDtoResponse } from './SignInDto'
import { SignInErrors } from './SignInErrors'
import { TextUtils } from '../../../../shared/utils'

export class SignInController extends BaseController {
  private useCase: SignInUseCase

  constructor(useCase: SignInUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(
    req: express.Request,
    res: express.Response,
  ): Promise<unknown> {
    let dto: SignInDtoRequest = req.body

    dto = {
      login: TextUtils.sanitize(dto.login),
      password: dto.password,
      keepSignedIn: dto.keepSignedIn,
    }

    try {
      const maybeErrorOrCorrectResponse = await this.useCase.execute(dto)

      if (maybeErrorOrCorrectResponse.isLeft()) {
        const error = maybeErrorOrCorrectResponse.value

        switch (error.constructor) {
          case SignInErrors.InvalidCredentialsError:
            return this.badRequest(res, error?.errorValue?.message)
          default:
            return this.fail(res, error?.errorValue?.message)
        }
      } else {
        const responseResult = maybeErrorOrCorrectResponse.value
        return this.ok<SignInDtoResponse>(res, responseResult.value)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
