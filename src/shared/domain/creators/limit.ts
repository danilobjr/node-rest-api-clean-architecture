import { pipe, trim } from 'ramda'
import { Guard, Result } from '../../core'
import { ValueObject } from '../'
import { propof } from '../../utils'
import { Pagination } from '../../infra/http/models/query'

type Props = {
  value: number
}

class Limit extends ValueObject<Props> {
  private static readonly DEFAULT_VALUE = 0

  get value() {
    return this.props.value
  }

  private constructor(props: Props) {
    super(props)
  }

  static create(value: string) {
    const propName = propof<Pagination>('limit')
    value = String(value)

    const notBlankResult = Guard.isNotBlank(propName, value)
    const valueIsBlank = !notBlankResult.succeeded
    if (valueIsBlank) {
      return Result.ok(new Limit({ value: this.DEFAULT_VALUE }))
    }

    const numericResult = Guard.isNumeric(propName, value)
    const nonNegativeResult = Guard.isGreaterOrEqualThan(
      propName,
      Number(value),
      this.DEFAULT_VALUE,
    )
    const result = Guard.combine([numericResult, nonNegativeResult])
    if (!result.succeeded) {
      return Result.fail<Limit>(result.message)
    }

    const formatter = pipe(trim, Number)

    return Result.ok(new Limit({ value: this.format(formatter, value) }))
  }
}

export { Limit }
