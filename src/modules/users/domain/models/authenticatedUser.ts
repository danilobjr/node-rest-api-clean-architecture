import { Gender, Role } from './'

type AuthenticatedUser = {
  _id: string
  name: string
  birthday: string
  gender: Gender
  code?: string
  cellphone: string
  cpf?: string
  email: string
  role: Role
}

export { AuthenticatedUser }
