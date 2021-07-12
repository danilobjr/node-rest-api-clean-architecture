import { curry, divide, is, multiply, pipe, __ } from 'ramda'

const toCurrency = (value: number) => {
  const valueIsNotANumber = !is(Number, value)

  if (valueIsNotANumber) {
    throw new Error(`Valor ${value} não é um número`)
  }

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

const convertIntegerPaymentAmountToCurrency = pipe(divide(__, 100), toCurrency)

const calculateValueGivenAPercentage = curry(
  (percentage: number, value: number) =>
    pipe(multiply(percentage), divide(__, 100))(value),
)

export {
  toCurrency,
  convertIntegerPaymentAmountToCurrency,
  calculateValueGivenAPercentage,
}
