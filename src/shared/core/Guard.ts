import { anyPass, equals, isEmpty, isNil } from 'ramda'
import { TextUtils } from '../utils'
import validator from 'validator'

export interface IGuardResult {
  succeeded: boolean
  message?: string
}

export interface IGuardArgument {
  propertyName: string
  propertyValue: unknown
}

export type GuardArgumentCollection = IGuardArgument[]

export class Guard {
  public static combine(guardResults: IGuardResult[]): IGuardResult {
    for (const result of guardResults) {
      if (result.succeeded === false) return result
    }

    return { succeeded: true }
  }

  public static isLowerOrEqualThan(
    propertyName: string,
    propertyValue: number,
    maxValue: number,
  ): IGuardResult {
    return propertyValue <= maxValue
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `${propertyName} deve ser menor ou igual a ${maxValue}`,
        }
  }

  public static isGreaterOrEqualThan(
    propertyName: string,
    propertyValue: number,
    minValue: number,
  ): IGuardResult {
    return propertyValue >= minValue
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `${propertyName} deve ser maior ou igual a ${minValue}`,
        }
  }

  public static isAtLeast(
    propertyName: string,
    numChars: number,
    propertyValue: string,
  ): IGuardResult {
    return propertyValue.length >= numChars
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `${propertyName} deve ter no mínimo ${numChars} caracteres`,
        }
  }

  public static isAtMost(
    propertyName: string,
    numChars: number,
    propertyValue: string,
  ): IGuardResult {
    return propertyValue.length <= numChars
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `${propertyName} deve ter no máximo ${numChars} caracteres`,
        }
  }

  public static hasLength(
    propertyName: string,
    propertyValue: string,
    length: number,
  ): IGuardResult {
    return propertyValue.length === length
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `${propertyName} deve ter ${length} caracteres`,
        }
  }

  public static isNotBlank(
    propertyName: string,
    propertyValue: unknown,
  ): IGuardResult {
    const valueIsEmpty = anyPass([isNil, isEmpty, equals('undefined')])(
      propertyValue,
    )

    if (valueIsEmpty) {
      return {
        succeeded: false,
        message: `${propertyName} não pode ficar em branco`,
      }
    } else {
      return { succeeded: true }
    }
  }

  public static isNotBlankBulk(args: GuardArgumentCollection): IGuardResult {
    for (const arg of args) {
      const result = this.isNotBlank(arg.propertyName, arg.propertyValue)
      if (!result.succeeded) return result
    }

    return { succeeded: true }
  }

  public static matchesRegex(
    propertyName: string,
    regex: RegExp,
    propertyValue: string,
  ): IGuardResult {
    if (!regex.test(propertyValue)) {
      return {
        succeeded: false,
        message: `${propertyName} não correponde à expressão regular`,
      }
    }

    return { succeeded: true }
  }

  public static isOneOf(
    propertyName: string,
    validValues: Readonly<string[]>,
    propertyValue: string,
  ): IGuardResult {
    let isValid = false
    for (const validValue of validValues) {
      if (propertyValue === validValue) {
        isValid = true
      }
    }

    if (isValid) {
      return { succeeded: true }
    } else {
      return {
        succeeded: false,
        message: `${propertyName} não correponde a um dos seguintes valores ${JSON.stringify(
          validValues,
        )}`,
      }
    }
  }

  public static isInRange(
    propertyName: string,
    min: number,
    max: number,
    num: number,
  ): IGuardResult {
    const isInRange = num >= min && num <= max
    if (!isInRange) {
      return {
        succeeded: false,
        message: `${propertyName} deve estar entre ${min} e ${max}`,
      }
    } else {
      return { succeeded: true }
    }
  }

  public static isAllInRange(
    propertyName: string,
    min: number,
    max: number,
    propertyValue: number[],
  ): IGuardResult {
    let failingResult: IGuardResult = null
    for (const num of propertyValue) {
      const numIsInRangeResult = this.isInRange(propertyName, min, max, num)
      if (!numIsInRangeResult.succeeded) failingResult = numIsInRangeResult
    }

    if (failingResult) {
      return {
        succeeded: false,
        message: failingResult.message,
      }
    } else {
      return { succeeded: true }
    }
  }

  public static isDate(
    format: string,
    propertyName: string,
    propertyValue: string,
  ): IGuardResult {
    if (!TextUtils.isDate(format, propertyValue)) {
      return {
        succeeded: false,
        message: `${propertyName} não é uma data válida`,
      }
    }

    return { succeeded: true }
  }

  public static isDateWithMmYyFormat(
    propertyName: string,
    propertyValue: string,
  ): IGuardResult {
    const mmYyFormatDate = /^(0[1-9]|1[0-2])\/\d{2}$/
    const valid = mmYyFormatDate.test(propertyValue)
    if (!valid) {
      return {
        succeeded: false,
        message: `${propertyName} deve estar no formato mm/YY`,
      }
    }

    return { succeeded: true }
  }

  public static isNumeric(
    propertyName: string,
    propertyValue: string,
  ): IGuardResult {
    if (!validator.isNumeric(propertyValue)) {
      return {
        succeeded: false,
        message: `${propertyName} não é um valor numérico`,
      }
    }

    return { succeeded: true }
  }

  public static hasOnlyLetters(
    propertyName: string,
    propertyValue: string,
  ): IGuardResult {
    if (!validator.isAlpha(propertyValue)) {
      return {
        succeeded: false,
        message: `${propertyName} deve conter apenas letras`,
      }
    }

    return { succeeded: true }
  }

  public static isUrl(
    propertyName: string,
    propertyValue: string,
  ): IGuardResult {
    if (!validator.isURL(propertyValue)) {
      return {
        succeeded: false,
        message: `${propertyName} não é uma URL válida`,
      }
    }

    return { succeeded: true }
  }
}
