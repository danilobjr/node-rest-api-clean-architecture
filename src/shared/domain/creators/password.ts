import bcrypt from 'bcryptjs'
import { ValueObject } from '../ValueObject'
import { Guard, Result } from '../../core'
import { CreatorOptions } from './shared'

export type PasswordProps = {
  value: string
}

export class Password extends ValueObject<PasswordProps> {
  private hashedPassword = ''

  get value(): string {
    return this.props.value
  }

  private constructor(props: PasswordProps) {
    super(props)
  }

  /**
   * @desc Compare a password candidate to user hashed one
   */
  static compare(
    hashedPassword: string,
    passwordCandidate: string,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      bcrypt.compare(
        passwordCandidate,
        hashedPassword,
        (err, compareResult) => {
          if (err) return resolve(false)
          return resolve(compareResult)
        },
      )
    })
  }

  private hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = 12
      bcrypt.hash(password, salt, (err, hashedPassword) => {
        if (err) return reject(err)
        this.hashedPassword = hashedPassword
        resolve(hashedPassword)
      })
    })
  }

  /**
   * @method toHashed
   * @desc Convert this plain password text to hashed one
   */
  public toHashed(): Promise<string> {
    return this.hashPassword(this.props.value)
  }

  public static create<T extends Record<string, unknown>>(
    passwordCandidate: string,
    options: CreatorOptions<T>,
  ): Result<Password> {
    const { propName, required } = options

    const notBlankResult = Guard.isNotBlank(propName, passwordCandidate)
    const passwordIsBlank = !notBlankResult.succeeded
    if (passwordIsBlank) {
      if (required) {
        return Result.fail<Password>(notBlankResult.message)
      } else {
        return Result.ok<Password>(new Password({ value: passwordCandidate }))
      }
    }

    const atLeastOneNumberAtLeastOneLetterAtLeast8CharactersLength =
      /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/
    const regex = atLeastOneNumberAtLeastOneLetterAtLeast8CharactersLength
    const regexResult = Guard.matchesRegex(propName, regex, passwordCandidate)
    if (!regexResult.succeeded) {
      return Result.fail<Password>(
        `${propName} deve seguir os seguintes critérios: ter pelo menos 8 caracteres, pelo menos menos 1 letra e pelo menos 1 número`,
      )
    }

    return Result.ok<Password>(new Password({ value: passwordCandidate }))
  }
}
