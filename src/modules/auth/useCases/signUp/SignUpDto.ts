type SignUpRequestDto = {
  name: string
  birthday: string
  gender?: string
  cpf?: string
  cellphone: string
  email?: string
  role: string
  zipCode?: string
  password: string
  passwordConfirmation: string
}

export { SignUpRequestDto }
