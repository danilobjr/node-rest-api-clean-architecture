import express from 'express'
import { DetailsUserUseCase as UseCase } from './DetailsUserUseCase'
import { DetailsUserRequestDto as RequestDto } from './DetailsUserDto'
import { DetailsUserErrors as Errors } from './DetailsUserErrors'
import { BaseController } from '../../../../shared/infra/http/models/BaseController'
import { TextUtils } from '../../../../shared/utils'

class DetailsUserController extends BaseController {
  constructor(private useCase: UseCase) {
    super()
  }

  async executeImpl(
    req: express.Request,
    res: express.Response,
  ): Promise<unknown> {
    const dto: RequestDto = {
      _id: TextUtils.sanitize(req.params?._id),
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

export { DetailsUserController }
