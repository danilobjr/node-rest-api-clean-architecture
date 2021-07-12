import { pipe, toLower, trim } from 'ramda'
import { Guard, Result } from '../../../../../shared/core'
import { ValueObject } from '../../../../../shared/domain'
import { propof } from '../../../../../shared/utils'
import { UpdateUserDataRequestDto } from '../../../../subscription/userData/useCases/update/UpdateUserDataDto'
import { State, states } from '../../models'

type AddressStateProps = {
  value: State
}

export class AddressState extends ValueObject<AddressStateProps> {
  private static readonly states = states

  get value() {
    return this.props.value
  }

  private constructor(props: AddressStateProps) {
    super(props)
  }

  public static create(valueCandidate: string): Result<AddressState> {
    const propName = propof<UpdateUserDataRequestDto>('addressState')

    const notBlankResult = Guard.isNotBlank(propName, valueCandidate)
    const valueIsBlank = !notBlankResult.succeeded
    if (valueIsBlank) {
      return Result.fail<AddressState>(notBlankResult.message)
    }

    const oneOfValuesResult = Guard.isOneOf(
      propName,
      AddressState.states,
      valueCandidate,
    )
    if (!oneOfValuesResult.succeeded) {
      return Result.fail<AddressState>(oneOfValuesResult.message)
    }

    const formatter = pipe(trim)

    return Result.ok<AddressState>(
      new AddressState({
        value: this.format(formatter, valueCandidate) as State,
      }),
    )
  }
}
