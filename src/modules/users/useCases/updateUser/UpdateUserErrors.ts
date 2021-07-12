import { Result, UseCaseError } from '../../../../shared/core'
import { propof } from '../../../../shared/utils'
import { UserId } from '../../domain/creators'
import { User } from '../../domain/models'

export namespace UpdateUserErrors {
  export class ValidationError extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, { message })
    }
  }

  export class NotFoundUserError extends Result<UseCaseError> {
    constructor(id: UserId) {
      super(false, {
        message: `User with ${id.value} ${propof<User>('_id')} was not found`,
      })
    }
  }

  export class UniqueUserError extends Result<UseCaseError> {
    constructor(propertyName: string, value: string) {
      super(false, {
        message: `User with ${value} ${propertyName} is already registered`,
      })
    }
  }

  export class ForbiddenError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `You are not allowed to change another users's data`,
      })
    }
  }
}
