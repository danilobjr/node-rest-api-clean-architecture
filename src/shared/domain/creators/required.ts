import { trim } from 'ramda'
import { Guard, Result } from '../../core'
import { ValueObject } from '../../domain'

type RequiredProps = {
  value: string
}

export class Required extends ValueObject<RequiredProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: RequiredProps) {
    super(props)
  }

  public static create<T>(valueCandidate: string, propName: keyof T): Result<Required> {
    const notBlankResult = Guard.isNotBlank(propName as string, valueCandidate)
    if (!notBlankResult.succeeded) {
      return Result.fail<Required>(notBlankResult.message)
    }

    return Result.ok<Required>(
      new Required({ value: this.format(trim, valueCandidate) }),
    )
  }
}
