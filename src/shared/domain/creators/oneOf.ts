import { map, pipe, toLower, trim } from 'ramda'
import { ValueObject } from '../ValueObject'
import { Guard, Result } from '../../core'
import { CreatorOptions } from './shared'

type OneOfProps = {
  value: string
}

export class OneOf extends ValueObject<OneOfProps> {
  get value() {
    return this.props.value
  }

  private constructor(props: OneOfProps) {
    super(props)
  }

  public static create<T extends object>(
    possibleValues: string[],
    valueCandidate: string,
    options?: CreatorOptions<T>,
  ): Result<OneOf> {
    const { required, propName } = options
    possibleValues = pipe(map(toLower))(possibleValues)
    valueCandidate = toLower(valueCandidate)

    const notBlankResult = Guard.isNotBlank(propName, valueCandidate)
    const valueIsBlank = !notBlankResult.succeeded
    if (valueIsBlank) {
      if (required) {
        return Result.fail<OneOf>(notBlankResult.message)
      } else {
        return Result.ok<OneOf>(new OneOf({ value: null }))
      }
    }

    const oneOfValuesResult = Guard.isOneOf(
      propName,
      possibleValues,
      valueCandidate,
    )
    if (!oneOfValuesResult.succeeded) {
      return Result.fail<OneOf>(oneOfValuesResult.message)
    }

    const formatter = pipe(trim)

    return Result.ok<OneOf>(
      new OneOf({
        value: this.format(formatter, valueCandidate),
      }),
    )
  }
}
