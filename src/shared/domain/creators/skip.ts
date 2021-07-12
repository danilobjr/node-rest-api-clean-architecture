import { pipe, trim } from 'ramda'
import { Guard, Result } from '../../core'
import { ValueObject } from '../'
import { propof } from '../../utils'
import { Pagination } from '../../infra/http/models/query'

type SkipProps = {
  value: number
}

class Skip extends ValueObject<SkipProps> {
  private static readonly DEFAULT_VALUE = 0

  get value() {
    return this.props.value
  }

  private constructor(props: SkipProps) {
    super(props)
  }

  static create(value: string) {
    const propName = propof<Pagination>('skip')
    value = String(value)

    const notBlankResult = Guard.isNotBlank(propName, value)
    const valueIsBlank = !notBlankResult.succeeded
    if (valueIsBlank) {
      return Result.ok(new Skip({ value: this.DEFAULT_VALUE }))
    }

    const numericResult = Guard.isNumeric(propName, value)
    const nonNegativeResult = Guard.isGreaterOrEqualThan(
      propName,
      Number(value),
      this.DEFAULT_VALUE,
    )
    const result = Guard.combine([numericResult, nonNegativeResult])
    if (!result.succeeded) {
      return Result.fail<Skip>(result.message)
    }

    const formatter = pipe(trim, Number)

    return Result.ok(new Skip({ value: this.format(formatter, value) }))
  }
}

export { Skip }
