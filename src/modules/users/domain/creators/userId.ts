import { trim } from 'ramda'
import { Guard, Result } from '../../../../shared/core'
import { ValueObject } from '../../../../shared/domain'

type UserIdProps = {
  value: string
}

export class UserId extends ValueObject<UserIdProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: UserIdProps) {
    super(props)
  }

  public static create(idCandidate: string): Result<UserId> {
    const propName = '_id'

    const notBlankResult = Guard.isNotBlank(propName, idCandidate)
    if (!notBlankResult.succeeded) {
      return Result.fail<UserId>(notBlankResult.message)
    }

    return Result.ok<UserId>(new UserId({ value: this.format(trim, idCandidate) }))
  }
}
