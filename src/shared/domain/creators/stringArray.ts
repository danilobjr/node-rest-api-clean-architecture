import { pipe, trim, uniq } from 'ramda'
import { Guard, Result } from '../../core'
import { ValueObject } from '../../domain'

type StringArrayProps = {
  value: string[]
}

export class StringArray extends ValueObject<StringArrayProps> {
  get value() {
    return this.props.value
  }

  private constructor(props: StringArrayProps) {
    super(props)
  }

  private static toArray = (value: string) => value.split(',')

  public static create(
    propertyName: string,
    valueCandidate: string,
    required = false,
  ): Result<StringArray> {
    valueCandidate = String(valueCandidate)

    const notBlankResult = Guard.isNotBlank(propertyName, valueCandidate)
    const valueIsBlankAndRequired = required && !notBlankResult.succeeded

    if (valueIsBlankAndRequired) {
      return Result.fail(notBlankResult.message)
    }

    const valueIsBlankButOptional = !notBlankResult.succeeded

    if (valueIsBlankButOptional) {
      return Result.ok<StringArray>(
        new StringArray({
          value: null,
        }),
      )
    }

    const formatter = pipe(trim, this.toArray, uniq)

    return Result.ok<StringArray>(
      new StringArray({
        value: this.format(formatter, valueCandidate),
      }),
    )
  }
}
