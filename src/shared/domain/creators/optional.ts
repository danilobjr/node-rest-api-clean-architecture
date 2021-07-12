import { trim } from 'ramda'
import { Guard, Result } from '../../core'
import { ValueObject } from '../../domain'

type OptionalProps = {
  value: string
}

export class Optional extends ValueObject<OptionalProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: OptionalProps) {
    super(props)
  }

  public static create<T>(valueCandidate: string, propName: keyof T): Result<Optional> {
    const notBlankResult = Guard.isNotBlank(propName as string, valueCandidate)
    const valueIsBlank = !notBlankResult.succeeded
    if (valueIsBlank) {
      return Result.ok<Optional>(new Optional({ value: '' }))
    }

    return Result.ok<Optional>(
      new Optional({ value: this.format(trim, valueCandidate) }),
    )
  }
}
