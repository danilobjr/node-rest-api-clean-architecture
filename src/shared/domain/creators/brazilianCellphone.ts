import { not, trim } from 'ramda'
import { ValueObject } from '../ValueObject'
import { Guard, IGuardResult, Result } from '../../core'
import { CreatorOptions } from './shared'

type BrazilianCellphoneProps = {
  value: string
}

export class BrazilianCellphone extends ValueObject<BrazilianCellphoneProps> {
  private static readonly MINIMUM_LENGTH = 10
  private static readonly MAXIMUM_LENGTH = 11

  get value(): string {
    return this.props.value
  }

  private constructor(props: BrazilianCellphoneProps) {
    super(props)
  }

  private static isDddValid(cellphone: string): IGuardResult {
    const dddsThatDontExist = [
      '20',
      '23',
      '25',
      '26',
      '29',
      '30',
      '36',
      '39',
      '40',
      '50',
      '52',
      '56',
      '57',
      '58',
      '59',
      '60',
      '70',
      '72',
      '76',
      '78',
      '80',
      '90',
    ]

    const ddd = cellphone.substr(0, 2)
    const dddIsNonExistentOne = dddsThatDontExist.includes(ddd)

    if (dddIsNonExistentOne) {
      return {
        succeeded: false,
        message: 'Invalid DDD',
      }
    }

    return { succeeded: true }
  }

  public static create<T extends Record<string, unknown>>(
    cellphoneCandidate: string,
    options: CreatorOptions<T>,
  ): Result<BrazilianCellphone> {
    const { propName, required } = options

    const notBlankResult = Guard.isNotBlank(propName, cellphoneCandidate)
    const cellphoneIsBlank = !notBlankResult.succeeded
    if (cellphoneIsBlank) {
      if (required) {
        return Result.fail<BrazilianCellphone>(notBlankResult.message)
      } else {
        return Result.ok<BrazilianCellphone>(
          new BrazilianCellphone({ value: cellphoneCandidate }),
        )
      }
    }

    const notNumericResult = Guard.isNumeric(propName, cellphoneCandidate)
    const atLeastResult = Guard.isAtLeast(
      propName,
      this.MINIMUM_LENGTH,
      cellphoneCandidate,
    )
    const atMostResult = Guard.isAtMost(
      propName,
      this.MAXIMUM_LENGTH,
      cellphoneCandidate,
    )
    const hasAnExistentDdd = this.isDddValid(cellphoneCandidate)

    const result = Guard.combine([
      atLeastResult,
      atMostResult,
      notNumericResult,
      hasAnExistentDdd,
    ])

    if (!result.succeeded) {
      return Result.fail<BrazilianCellphone>(result.message)
    }

    return Result.ok<BrazilianCellphone>(
      new BrazilianCellphone({ value: this.format(trim, cellphoneCandidate) }),
    )
  }
}
