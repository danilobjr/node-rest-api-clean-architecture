import { Result, UseCaseError } from '../../../../shared/core'

export namespace SignUpErrors {
  export class ValidationError extends Result<UseCaseError> {
    constructor(message: string) {
      const success = false
      super(success, { message })
    }
  }

  export class UniqueUserError extends Result<UseCaseError> {
    constructor(propertyName: string, value: string) {
      super(false, {
        message: `User with ${value} ${propertyName} is already registered`,
      })
    }
  }
}
