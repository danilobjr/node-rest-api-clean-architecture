import { trim } from 'ramda'
import { Guard, Result } from '../../../../shared/core'
import { ValueObject } from '../../../../shared/domain'

type UserNameProps = {
  value: string
}

export class UserName extends ValueObject<UserNameProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: UserNameProps) {
    super(props)
  }

  public static create(nameCandidate: string): Result<UserName> {
    const propName = 'name'

    const notBlankResult = Guard.isNotBlank(propName, nameCandidate)
    if (!notBlankResult.succeeded) {
      return Result.fail<UserName>(notBlankResult.message)
    }

    return Result.ok<UserName>(new UserName({ value: this.format(trim, nameCandidate) }))
  }
}
