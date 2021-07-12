import { Guard, Result } from '../../../../shared/core'
import { ValueObject } from '../../../../shared/domain'
import { Role, roles } from '../models'

type UserRoleProps = {
  value: Role
}

export class UserRole extends ValueObject<UserRoleProps> {
  private static readonly DEFAULT_ROLE: Role = 'free'

  get value(): string {
    return this.props.value
  }

  constructor(props: UserRoleProps) {
    super(props)
  }

  public static create(roleCandidate: Role = this.DEFAULT_ROLE) {
    const propName = 'role'

    const notBlankResult = Guard.isNotBlank(propName, roleCandidate)
    if (!notBlankResult.succeeded) {
      const useDefaultValue = () =>
        Result.ok<UserRole>(new UserRole({ value: roleCandidate }))
      return useDefaultValue()
    }

    const oneOfResult = Guard.isOneOf(propName, roles, roleCandidate)
    if (!oneOfResult.succeeded) {
      return Result.fail<UserRole>(oneOfResult.message)
    }

    return Result.ok<UserRole>(new UserRole({ value: roleCandidate as Role }))
  }
}
