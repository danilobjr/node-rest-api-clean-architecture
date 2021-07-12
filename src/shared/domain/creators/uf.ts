import { pipe, trim } from 'ramda'
import { ValueObject } from '..'
import { State, states } from '../../../modules/users/domain/models'
import { Guard, Result } from '../../core'
import { CreatorOptions } from './shared'

type UfProps = {
  value: State
}

export class Uf extends ValueObject<UfProps> {
  private static readonly states = states

  get value() {
    return this.props.value
  }

  private constructor(props: UfProps) {
    super(props)
  }

  public static create<T extends object>(
    valueCandidate: string,
    options: CreatorOptions<T>,
  ): Result<Uf> {
    const { propName, required } = options

    const notBlankResult = Guard.isNotBlank(propName, valueCandidate)
    const valueIsBlank = !notBlankResult.succeeded
    if (valueIsBlank) {
      if (required) {
        return Result.fail<Uf>(notBlankResult.message)
      } else {
        return Result.ok<Uf>(new Uf({ value: null }))
      }
    }

    const oneOfValuesResult = Guard.isOneOf(propName, Uf.states, valueCandidate)
    if (!oneOfValuesResult.succeeded) {
      return Result.fail<Uf>(oneOfValuesResult.message)
    }

    const formatter = pipe(trim)

    return Result.ok<Uf>(
      new Uf({
        value: this.format(formatter, valueCandidate) as State,
      }),
    )
  }
}
