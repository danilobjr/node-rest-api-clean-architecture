import {
  ListUsersRequestDto as RequestDto,
  ListUsersResponseDto as ResponseDto,
} from './ListUsersDto'
import { ListUsersErrors as Errors } from './ListUsersErrors'
import {
  AppError,
  UseCase,
  Result,
  Either,
  left,
  right,
} from '../../../../shared/core'
import { IUserRepo } from '../../repos'
import {
  Limit,
  Optional,
  Ordering,
  Skip,
  SortBy,
} from '../../../../shared/domain/creators'
import { User } from '../../domain/models'

type Failure = AppError.UnexpectedError
type Success = Result<ResponseDto>
type Response = Either<Failure, Success>

class ListUsersUseCase implements UseCase<RequestDto, Promise<Response>> {
  constructor(private repo: IUserRepo) {}

  async execute(dto: RequestDto): Promise<Response> {
    try {
      const skipOrError = Skip.create(dto.skip)
      const limitOrError = Limit.create(dto.limit)
      const sortByOrError = SortBy.create<User>(dto.sortBy, 'name', [
        'name',
        'birthday',
        'gender',
        'role',
      ])
      const orderingOrError = Ordering.create(dto.ordering)
      const result = Result.combine([
        skipOrError,
        limitOrError,
        sortByOrError,
        orderingOrError,
      ])
      if (result.isFailure) {
        return left(new Errors.ValidationError(result.error as string))
      }

      const searchTermResult = Optional.create<RequestDto>(
        dto.searchTerm,
        'searchTerm',
      )

      const skip = skipOrError.value
      const limit = limitOrError.value
      const sortBy = sortByOrError.value
      const ordering = orderingOrError.value
      const searchTerm = searchTermResult.value

      const users = await this.repo.find({
        limit: limit.value,
        skip: skip.value,
        sortBy: sortBy.value,
        ordering: ordering.value,
        searchTerm: searchTerm.value,
      })

      const responseDto = {
        data: users,
      }

      return right(Result.ok(responseDto))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}

export { ListUsersUseCase }
