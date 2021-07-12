import validator from 'validator'
import { pipe, toLower, trim } from 'ramda'
import { ValueObject } from '..'
import { Guard, Result } from '../../core'
import { CreatorOptions } from './shared'

export type EmailProps = {
  value: string
}

export class Email extends ValueObject<EmailProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: EmailProps) {
    super(props)
  }

  public static create<T extends object>(
    emailCandidate: string,
    options: CreatorOptions<T>,
  ): Result<Email> {
    const { propName, required } = options

    const notBlankResult = Guard.isNotBlank(propName, emailCandidate)
    const emailIsBlank = !notBlankResult.succeeded
    if (emailIsBlank) {
      if (required) {
        return Result.fail<Email>(notBlankResult.message)
      } else {
        return Result.ok<Email>(new Email({ value: emailCandidate }))
      }
    }

    if (!validator.isEmail(emailCandidate)) {
      return Result.fail<Email>(`${propName} inválido`)
    }

    const formatter = pipe(trim, toLower)

    return Result.ok<Email>(
      new Email({ value: this.format(formatter, emailCandidate) }),
    )
  }
}
