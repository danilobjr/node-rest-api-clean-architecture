import { ResponseDto } from '../../../../../shared/domain'
import { User } from '../../../domain/models'

export type CreateUserRequestDto = {
  name: string
  birthday: string
  gender?: string
  cpf?: string
  cellphone: string
  email?: string
  zipCode?: string
  password: string
  passwordConfirmation: string
}

type CreatedUser = {
  createdUser: User
}

export type CreateUserResponseDto = ResponseDto<CreatedUser>
