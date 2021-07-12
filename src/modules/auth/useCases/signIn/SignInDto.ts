import { ResponseDto } from '../../../../shared/domain'
import { AuthenticationDto } from '../../../users/domain/models'

export type SignInDtoRequest = {
  login: string
  password: string
  keepSignedIn: boolean
}

export type SignInDtoResponse = ResponseDto<AuthenticationDto>
