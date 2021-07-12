import { UseCaseError } from '../../../../shared/core/UseCaseError'
import { Result } from '../../../../shared/core'

export namespace CreateUserErrors {
  export class ValidationError extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, { message })
    }
  }

  export class UniqueUserError extends Result<UseCaseError> {
    constructor(propertyName: string, value: string) {
      super(false, {
        message: `A user with ${value} ${propertyName} is already registered`,
      })
    }
  }
}
