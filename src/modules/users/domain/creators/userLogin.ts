import validator from 'validator'
import { trim } from 'ramda'
import { Guard, Result } from '../../../../shared/core'
import { ValueObject } from '../../../../shared/domain'
import { UserCpf } from './userCpf'
import { CellphoneOrCpfOrEmail } from '../models'

type UserLoginProps = {
  propName: CellphoneOrCpfOrEmail
  value: string
}

class UserLogin extends ValueObject<UserLoginProps> {
  get value() {
    return this.props.value
  }

  get propName() {
    return this.props.propName
  }

  private constructor(props: UserLoginProps) {
    super(props)
  }

  /**
   * @desc User can enter a _cellphone_, _email_, or _cpf_ as a **login** credential
   * or some other field identification like when he forgot his password.
   * This method infers, through that value, which was the User intent.
   * Then it returns the correct property name of User entity: _cellphone_, _email_, or _cpf_.
   * @param value A value that refers to either a _cellphone_, an _email_, or a _cpf_.
   * @returns one of the following string values: _cellphone_, _email_, or _cpf_.
   */
  static getCorrectUserProp(value: string): CellphoneOrCpfOrEmail {
    if (validator.isEmail(value)) {
      return 'email'
    } else if (UserCpf.isValidCpf(value)) {
      return 'cpf'
    } else {
      return 'cellphone'
    }
  }

  public static create(
    valueCandidate: string,
    propName: string,
  ): Result<UserLoginProps> {
    const notBlankResult = Guard.isNotBlank(propName, valueCandidate)
    if (!notBlankResult.succeeded) {
      return Result.fail<UserLoginProps>(notBlankResult.message)
    }

    const userProp = this.getCorrectUserProp(valueCandidate)

    return Result.ok<UserLoginProps>(
      new UserLogin({
        value: this.format(trim, valueCandidate),
        propName: userProp,
      }),
    )
  }
}

export { UserLogin }
