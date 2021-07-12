import express from 'express'
import { GetLocationInfoByZipCodeRequestDto as RequestDto } from './GetLocationInfoByZipCodeDto'
import { GetLocationInfoByZipCodeErrors as Errors } from './GetLocationInfoByZipCodeErrors'
import { BaseController } from '../../../../../shared/infra/http/models'
import { GetLocationInfoByZipCodeUseCase as UseCase } from './GetLocationInfoByZipCodeUseCase'
import { TextUtils } from '../../../../../shared/utils'

class GetLocationInfoByZipCodeController extends BaseController {
  constructor(private useCase: UseCase) {
    super()
  }

  async executeImpl(
    req: express.Request,
    res: express.Response,
  ): Promise<unknown> {
    try {
      const dto: RequestDto = {
        zipCode: TextUtils.sanitize(req.params?.zipCode as string),
      }

      const maybeErrorOrCorrectResponse = await this.useCase.execute(dto)

      if (maybeErrorOrCorrectResponse.isLeft()) {
        const error = maybeErrorOrCorrectResponse.value

        switch (error.constructor) {
          case Errors.ValidationError:
            return this.badRequest(res, error?.errorValue?.message)
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

export { GetLocationInfoByZipCodeController }
