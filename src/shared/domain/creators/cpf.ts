import validator from 'validator'
import { trim } from 'ramda'
import { ValueObject } from '../'
import { CreatorOptions } from './shared'
import { Guard, Result } from '../../core'

type CpfProps = {
  value: string
}

export class Cpf extends ValueObject<CpfProps> {
  private static readonly LENGTH = 11

  get value(): string {
    return this.props.value
  }

  private constructor(props: CpfProps) {
    super(props)
  }

  private static calculateCpfVerifierDigit(cpf: string) {
    const digits = cpf.split('').map(Number)

    const [result] = digits.reduceRight(
      (accu, digit) => {
        let [sum, weight] = accu
        sum = digit * weight + sum
        weight = weight + 1
        return [sum, weight]
      },
      [0, 2],
    )

    const resto = result % 11
    let verifierDigit = 0

    if (resto >= 2) {
      verifierDigit = 11 - resto
    }

    return String(verifierDigit)
  }

  public static isValidCpf(cpf: string) {
    if (!validator.isNumeric(cpf)) {
      return false
    }

    if (cpf.length !== 11) {
      return false
    }

    const nineFirstDigits = cpf.substr(0, 9)
    const tenFirstDigits = cpf.substr(0, 10)

    const firstVerifierDigit = Cpf.calculateCpfVerifierDigit(nineFirstDigits)
    const secondVerifierDigit = Cpf.calculateCpfVerifierDigit(tenFirstDigits)

    const calculatedCpf =
      nineFirstDigits + firstVerifierDigit + secondVerifierDigit

    return cpf === calculatedCpf
  }

  public static create<T extends Record<string, unknown>>(
    cpfCandidate: string,
    options: CreatorOptions<T>,
  ): Result<Cpf> {
    const { propName, required } = options

    const notBlankResult = Guard.isNotBlank(propName, cpfCandidate)
    const cpfIsBlank = !notBlankResult.succeeded
    if (cpfIsBlank) {
      if (required) {
        return Result.fail<Cpf>(notBlankResult.message)
      } else {
        return Result.ok<Cpf>(new Cpf({ value: cpfCandidate }))
      }
    }

    const hasCorrectLengthResult = Guard.hasLength(
      propName,
      cpfCandidate,
      this.LENGTH,
    )
    if (!hasCorrectLengthResult.succeeded) {
      return Result.fail<Cpf>(hasCorrectLengthResult.message)
    }

    if (!Cpf.isValidCpf(cpfCandidate)) {
      return Result.fail<Cpf>('Invalid CPF')
    }

    return Result.ok<Cpf>(new Cpf({ value: this.format(trim, cpfCandidate) }))
  }
}
