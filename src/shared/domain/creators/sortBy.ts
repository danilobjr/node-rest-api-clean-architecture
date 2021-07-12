import { pipe, trim } from 'ramda'
import { Guard, Result } from '../../core'
import { ValueObject } from '../'
import { Sort } from '../../infra/http/models'
import { propof } from '../../utils'

type SortByProps<T> = {
  value: keyof T
}

export class SortBy<T> extends ValueObject<SortByProps<T>> {
  get value() {
    return this.props.value
  }

  private constructor(props: SortByProps<T>) {
    super(props)
  }

  public static create<T>(
    value: string,
    defaultValue: keyof T,
    possibleValues: (keyof T)[],
  ): Result<SortBy<T>> {
    const propName = propof<Sort>('sortBy')
    value = String(value)

    possibleValues = [
      ...(['createdAt', 'updatedAt'] as (keyof T)[]),
      ...possibleValues,
    ]

    const notBlankResult = Guard.isNotBlank(propName, value)
    const valueIsBlank = !notBlankResult.succeeded
    if (valueIsBlank) {
      return Result.ok<SortBy<T>>(new SortBy({ value: defaultValue }))
    }

    const oneOfResult = Guard.isOneOf(
      propName,
      possibleValues as string[],
      value,
    )
    if (!oneOfResult.succeeded) {
      return Result.fail<SortBy<T>>(oneOfResult.message)
    }

    return Result.ok<SortBy<T>>(
      new SortBy({
        value: this.format(trim, value) as SortByProps<T>['value'],
      }),
    )
  }
}
