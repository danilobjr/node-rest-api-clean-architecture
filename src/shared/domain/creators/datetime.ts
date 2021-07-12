import { defaultTo, trim } from 'ramda'
import { Guard, Result } from '../../core'
import { fromFormat, now } from '../../utils'
import { ValueObject } from '../ValueObject'
import { CreatorOptions } from './shared'

type DatetimeOptions<T extends Record<string, unknown>> = CreatorOptions<T> & {
  format?: string
  shouldBeOnPast?: boolean
  shouldBeOnFuture?: boolean
}

type DatetimeProps = {
  value: Date
}

export class Datetime extends ValueObject<DatetimeProps> {
  get value() {
    return this.props.value
  }

  private constructor(props: DatetimeProps) {
    super(props)
  }

  public static create<T extends Record<string, unknown>>(
    valueCandidate: string,
    options: DatetimeOptions<T>,
  ): Result<Datetime> {
    const {
      propName,
      required,
      format = defaultTo('dd/MM/yyyy', options.format),
      shouldBeOnPast,
      shouldBeOnFuture,
    } = options

    const notBlankResult = Guard.isNotBlank(propName as string, valueCandidate)
    const valueIsBlank = !notBlankResult.succeeded

    if (valueIsBlank) {
      if (required) {
        return Result.fail<Datetime>(notBlankResult.message)
      } else {
        return Result.ok<Datetime>(new Datetime({ value: null }))
      }
    }

    const dateResult = Guard.isDate(format, propName as string, valueCandidate)
    if (!dateResult.succeeded) {
      return Result.fail<Datetime>(dateResult.message)
    }

    const valueInstance = fromFormat(format)(valueCandidate)
    const dateIsOnFuture = valueInstance > now()
    const dateIsOnPast = valueInstance < now()
    if (shouldBeOnPast && dateIsOnFuture) {
      return Result.fail<Datetime>(`${propName} should be on past`)
    }
    if (shouldBeOnFuture && dateIsOnPast) {
      return Result.fail<Datetime>(`${propName} should be on future`)
    }

    const value = new Date(this.format(trim, valueCandidate))

    return Result.ok<Datetime>(new Datetime({ value }))
  }
}
