import { trim } from 'ramda'
import { ValueObject } from '..'
import { Guard, Result } from '../../core'
import { CreatorOptions } from './shared'

type ZipCodeProps = {
  value: string
}

export class ZipCode extends ValueObject<ZipCodeProps> {
  private static readonly LENGTH = 8

  get value(): string {
    return this.props.value
  }

  private constructor(props: ZipCodeProps) {
    super(props)
  }

  public static create<T extends object>(
    valueCandidate: string,
    options: CreatorOptions<T>,
  ): Result<ZipCode> {
    const { propName, required } = options

    const notBlankResult = Guard.isNotBlank(propName as string, valueCandidate)
    const valueIsBlank = !notBlankResult.succeeded
    if (valueIsBlank) {
      if (required) {
        return Result.fail<ZipCode>(notBlankResult.message)
      } else {
        return Result.ok<ZipCode>(new ZipCode({ value: valueCandidate }))
      }
    }

    const hasLengthResult = Guard.hasLength(
      propName,
      valueCandidate,
      this.LENGTH,
    )
    const numericResult = Guard.isNumeric(propName, valueCandidate)
    const result = Guard.combine([hasLengthResult, numericResult])
    if (!result.succeeded) {
      return Result.fail<ZipCode>(result.message)
    }

    return Result.ok<ZipCode>(
      new ZipCode({ value: this.format(trim, valueCandidate) }),
    )
  }
}
