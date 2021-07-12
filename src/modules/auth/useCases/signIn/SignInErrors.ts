import { Result, UseCaseError } from '../../../../shared/core'

export namespace SignInErrors {
  export class InvalidCredentialsError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Invalid login and/or password' })
    }
  }
}
