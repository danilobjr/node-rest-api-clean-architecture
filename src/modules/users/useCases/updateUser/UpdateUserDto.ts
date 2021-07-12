import { ResponseDto } from '../../../../shared/domain'
import { WithAuthenticatedUser } from '../../../../shared/infra/http/models'
import { User } from '../../domain/models'

export type UpdateUserRequestDto = WithAuthenticatedUser & {
  _id: string
  name: string
  gender: string
  birthday: string
  cellphone: string
  email?: string
  cpf?: string
  addressZipCode?: string
}

export type UpdateUserResponseDto = ResponseDto<User>
