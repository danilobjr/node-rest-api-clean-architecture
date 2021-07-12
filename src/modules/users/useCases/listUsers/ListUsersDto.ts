import { User } from '../../domain/models'
import { ResponseDto } from '../../../../shared/domain'
import { Query } from '../../../../shared/infra/http/models'

type ListUsersRequestDto = Query

type ListUsersResponseDto = ResponseDto<User[]>

export { ListUsersRequestDto, ListUsersResponseDto }
