import { Result } from './Result'
import { UseCaseError } from './UseCaseError'

export namespace AppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public constructor(error: unknown) {
      super(false, {
        message: 'Oops... Erro no servidor',
        error,
      } as UseCaseError)

      console.log('[AppError]: An unexpected error occurred')
      console.error(error)
    }
  }
}
