import { Guard, Result } from '../../../../shared/core'
import { ValueObject } from '../../../../shared/domain'

type UserPasswordConfirmationProps = {
  value: string
}

export class UserPasswordConfirmation extends ValueObject<UserPasswordConfirmationProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: UserPasswordConfirmationProps) {
    super(props)
  }

  public static create(
    passwordConfirmationCandidate: string,
    passwordToBeCompared: string,
  ): Result<UserPasswordConfirmation> {
    const propName = 'passwordConfirmation'

    const nullOrUndefinedResult = Guard.isNotBlank(propName, passwordConfirmationCandidate)
    if (!nullOrUndefinedResult.succeeded) {
      return Result.fail<UserPasswordConfirmation>(nullOrUndefinedResult.message)
    }

    if (passwordConfirmationCandidate !== passwordToBeCompared) {
      return Result.fail<UserPasswordConfirmation>(
        `Valores de ${propName} e password devem ser iguais`,
      )
    }

    return Result.ok<UserPasswordConfirmation>(
      new UserPasswordConfirmation({
        value: passwordConfirmationCandidate,
      }),
    )
  }
}
