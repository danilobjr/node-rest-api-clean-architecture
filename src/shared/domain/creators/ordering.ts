import { pipe, trim } from 'ramda'
import { Guard, Result } from '../../core'
import { OrderingType, ValueObject } from '../'
import { propof } from '../../utils'
import { Sort } from '../../infra/http/models'
import { getEnumKeysAsArray } from '../../utils/ObjectUtils'

type OrderingProps = {
  value: OrderingType
}

export class Ordering extends ValueObject<OrderingProps> {
  private static readonly DEFAULT_VALUE = 1
  private static readonly POSSIBLE_VALUES = getEnumKeysAsArray(OrderingType)

  get value() {
    return this.props.value
  }

  private constructor(props: OrderingProps) {
    super(props)
  }

  public static create(value: string): Result<Ordering> {
    const propName = propof<Sort>('ordering')
    value = String(value)

    const notBlankResult = Guard.isNotBlank(propName, value)
    const valueIsBlank = !notBlankResult.succeeded
    if (valueIsBlank) {
      return Result.ok<Ordering>(new Ordering({ value: this.DEFAULT_VALUE }))
    }

    const oneOfResult = Guard.isOneOf(propName, this.POSSIBLE_VALUES, value)
    if (!oneOfResult.succeeded) {
      return Result.fail<Ordering>(oneOfResult.message)
    }

    const formatter = pipe<string, string, number>(trim, Number)
    this.format(formatter, value)

    return Result.ok<Ordering>(
      new Ordering({ value: OrderingType[value] }),
    )
  }
}
