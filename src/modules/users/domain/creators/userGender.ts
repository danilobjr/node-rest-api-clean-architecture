import { pipe, toLower, trim } from 'ramda'
import { Guard, Result } from '../../../../shared/core'
import { ValueObject } from '../../../../shared/domain'
import { Gender, genders } from '../models'

type UserGenderProps = {
  value: Gender
}

export class UserGender extends ValueObject<UserGenderProps> {
  private static readonly genders = genders

  get value() {
    return this.props.value
  }

  private constructor(props: UserGenderProps) {
    super(props)
  }

  public static create(genderCandidate: string): Result<UserGender> {
    const propName = 'gender'

    const notBlankResult = Guard.isNotBlank(propName, genderCandidate)
    if (!notBlankResult.succeeded) {
      return Result.ok<UserGender>(
        new UserGender({ value: genderCandidate as Gender }),
      )
    }

    const oneOfValuesResult = Guard.isOneOf(
      propName,
      UserGender.genders,
      genderCandidate,
    )
    if (!oneOfValuesResult.succeeded) {
      return Result.fail<UserGender>(oneOfValuesResult.message)
    }

    const formatter = pipe(trim, toLower)

    return Result.ok<UserGender>(
      new UserGender({
        value: this.format(formatter, genderCandidate) as Gender,
      }),
    )
  }
}
