import { Result, UseCaseError } from '../../../../../shared/core'

export namespace GetCitiesByUfErrors {
  export class ValidationError extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, { message })
    }
  }
}
