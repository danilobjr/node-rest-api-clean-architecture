import { Result, UseCaseError } from '../../../../shared/core'

export namespace ListUsersErrors {
  export class ValidationError extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, { message })
    }
  }
}
