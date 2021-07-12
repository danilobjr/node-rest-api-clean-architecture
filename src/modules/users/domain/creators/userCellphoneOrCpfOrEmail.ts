import validator from 'validator'
import { trim } from 'ramda'
import { Guard, Result } from '../../../../shared/core'
import { ValueObject } from '../../../../shared/domain'
import { CellphoneOrCpfOrEmail, User } from '../models'
import { UserCellphone } from './userCellphone'
import { UserCpf } from './userCpf'
import { Email } from '../../../../shared/domain/creators'

type UserCellphoneOrCpfOrEmailProps = {
  propName: CellphoneOrCpfOrEmail
  value: string
}

class UserCellphoneOrCpfOrEmail extends ValueObject<
  UserCellphoneOrCpfOrEmailProps
> {
  get value() {
    return this.props.value
  }

  get propName() {
    return this.props.propName
  }

  private constructor(props: UserCellphoneOrCpfOrEmailProps) {
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
  private static getCorrectUserProp(value: string): CellphoneOrCpfOrEmail {
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
  ): Result<UserCellphoneOrCpfOrEmail> {
    const notBlankResult = Guard.isNotBlank(propName, valueCandidate)
    const valueIsBlank = !notBlankResult.succeeded
    if (valueIsBlank) {
      return Result.fail<UserCellphoneOrCpfOrEmail>(notBlankResult.message)
    }

    const userProp = this.getCorrectUserProp(valueCandidate)

    switch (userProp) {
      case 'cellphone':
        const cellphoneOrError = UserCellphone.create(valueCandidate)
        if (cellphoneOrError.isFailure) {
          return Result.fail<UserCellphoneOrCpfOrEmail>(
            cellphoneOrError.error as string,
          )
        }
        const cellphone = cellphoneOrError.value
        valueCandidate = cellphone.value
        break
      case 'cpf':
        const cpfOrError = UserCpf.create(valueCandidate)
        if (cpfOrError.isFailure) {
          return Result.fail<UserCellphoneOrCpfOrEmail>(
            cpfOrError.error as string,
          )
        }
        const cpf = cpfOrError.value
        valueCandidate = cpf.value
        break
      case 'email':
        const emailOrError = Email.create<User>(valueCandidate, {
          propName: 'email',
          required: true,
        })
        if (emailOrError.isFailure) {
          return Result.fail<UserCellphoneOrCpfOrEmail>(
            emailOrError.error as string,
          )
        }
        const email = emailOrError.value
        valueCandidate = email.value
        break
    }

    return Result.ok<UserCellphoneOrCpfOrEmail>(
      new UserCellphoneOrCpfOrEmail({
        value: this.format(trim, valueCandidate),
        propName: userProp,
      }),
    )
  }
}

export { UserCellphoneOrCpfOrEmail }
