import { Result, UseCaseError } from '../../../../shared/core'
import { propof } from '../../../../shared/utils'
import { User } from '../../domain/models'

export namespace DetailsUserErrors {
  export class ValidationError extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, { message })
    }
  }

  export class NotFoundUserError extends Result<UseCaseError> {
    constructor(userId: string) {
      super(false, {
        message: `User with ${userId} ${propof<User>('_id')} was not found`,
      })
    }
  }
}
