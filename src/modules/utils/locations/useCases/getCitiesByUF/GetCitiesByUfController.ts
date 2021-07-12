import express from 'express'
import { GetCitiesByUfRequestDto as RequestDto } from './GetCitiesByUfDto'
import { GetCitiesByUfErrors as Errors } from './GetCitiesByUfErrors'
import { BaseController } from '../../../../../shared/infra/http/models'
import { GetCitiesByUfUseCase as UseCase } from './GetCitiesByUfUseCase'
import { TextUtils } from '../../../../../shared/utils'

class GetCitiesByUfController extends BaseController {
  constructor(private useCase: UseCase) {
    super()
  }

  async executeImpl(
    req: express.Request,
    res: express.Response,
  ): Promise<unknown> {
    try {
      const dto: RequestDto = {
        uf: TextUtils.sanitize(req.params?.uf as string),
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

export { GetCitiesByUfController }
