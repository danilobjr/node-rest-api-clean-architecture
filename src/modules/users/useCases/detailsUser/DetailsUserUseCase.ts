import {
  DetailsUserRequestDto as RequestDto,
  DetailsUserResponseDto as ResponseDto,
} from './DetailsUserDto'
import { DetailsUserErrors as Errors } from './DetailsUserErrors'
import { Either, Result, left, right } from '../../../../shared/core'
import { AppError } from '../../../../shared/core/AppError'
import { UseCase } from '../../../../shared/core/UseCase'
import { IUserRepo } from '../../repos'
import { Required } from '../../../../shared/domain/creators'
import { add, defaultTo, filter, head, map, pipe, reduce } from 'ramda'
import { OrderingType } from '../../../../shared/domain'

type Failure =
  | Errors.ValidationError
  | Errors.NotFoundUserError
  | AppError.UnexpectedError
type Success = Result<ResponseDto>
type Response = Either<Failure, Success>

class DetailsUserUseCase implements UseCase<RequestDto, Promise<Response>> {
  constructor(private userRepo: IUserRepo) {}

  async execute(dto: RequestDto): Promise<Response> {
    try {
      const userIdOrError = Required.create<RequestDto>(dto._id, '_id')
      if (userIdOrError.isFailure) {
        return left(new Errors.ValidationError(userIdOrError.error as string))
      }

      const userId = userIdOrError.value

      const foundUser = await this.userRepo.findById(userId.value)
      if (!foundUser) {
        return left(new Errors.NotFoundUserError(userId.value))
      }

      const responseDto: ResponseDto = {
        data: foundUser,
      }

      return right(Result.ok(responseDto))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}

export { DetailsUserUseCase }
