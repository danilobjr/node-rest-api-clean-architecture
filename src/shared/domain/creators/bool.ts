import { equals, pipe, trim } from 'ramda'
import { ValueObject } from '../ValueObject'
import { Guard, Result } from '../../core'
import { CreatorOptions } from './shared'

type BoolProps = {
  value: boolean
}

export class Bool extends ValueObject<BoolProps> {
  private static POSSIBLE_VALUES = ['true', 'false']

  get value() {
    return this.props.value
  }

  private constructor(props: BoolProps) {
    super(props)
  }

  public static create<T extends object>(
    valueCandidate: string,
    options?: CreatorOptions<T>,
  ): Result<Bool> {
    const { required, propName } = options

    const notBlankResult = Guard.isNotBlank(propName, valueCandidate)
    const valueIsBlank = !notBlankResult.succeeded
    if (valueIsBlank) {
      if (required) {
        return Result.fail<Bool>(notBlankResult.message)
      } else {
        return Result.ok<Bool>(new Bool({ value: null }))
      }
    }

    const possibleValuesResult = Guard.isOneOf(
      propName,
      this.POSSIBLE_VALUES,
      valueCandidate,
    )
    if (!possibleValuesResult.succeeded) {
      return Result.fail<Bool>(possibleValuesResult.message)
    }

    const formatter = pipe(trim)

    return Result.ok<Bool>(
      new Bool({
        value: pipe(formatter, equals('true'))(valueCandidate),
      }),
    )
  }
}
