import { ResponseDto } from '../../../../shared/domain/ResponseDto'
import { User } from '../../domain/models'

type DetailsUserRequestDto = {
  _id: string
}

type DetailsUserResponseDto = ResponseDto<User>

export { DetailsUserRequestDto, DetailsUserResponseDto }
