import { trim } from 'ramda'
import { Guard, Result } from '../../core'
import { ValueObject } from '../../domain'
import { CreatorOptions } from './shared'

type PositiveNumberProps = {
  value: number
}

type PositiveNumberOptions<T extends object> = CreatorOptions<T> & {
  minValue?: number
}

export class PositiveNumber extends ValueObject<PositiveNumberProps> {
  static readonly MIN_VALUE = 0

  get value() {
    return this.props.value
  }

  private constructor(props: PositiveNumberProps) {
    super(props)
  }

  public static create<T extends object>(
    valueCandidate: string,
    options?: PositiveNumberOptions<T>,
  ): Result<PositiveNumber> {
    const { minValue, propName, required } = options

    const notBlankResult = Guard.isNotBlank(propName as string, valueCandidate)
    if (!required && !notBlankResult.succeeded) {
      return Result.ok<PositiveNumber>(new PositiveNumber({ value: 0 }))
    }

    const numericResult = Guard.isNumeric(propName as string, valueCandidate)
    const combineResult = Guard.combine([notBlankResult, numericResult])
    if (!combineResult.succeeded) {
      return Result.fail<PositiveNumber>(combineResult.message)
    }

    const greaterOrEqualThanResult = Guard.isGreaterOrEqualThan(
      propName as string,
      Number(valueCandidate),
      minValue || this.MIN_VALUE,
    )
    if (!greaterOrEqualThanResult.succeeded) {
      return Result.fail<PositiveNumber>(greaterOrEqualThanResult.message)
    }

    const value = Number(this.format(trim, valueCandidate))

    return Result.ok<PositiveNumber>(new PositiveNumber({ value }))
  }
}
