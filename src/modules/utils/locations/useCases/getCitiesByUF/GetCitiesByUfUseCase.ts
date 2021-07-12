import {
  GetCitiesByUfRequestDto as RequestDto,
  GetCitiesByUfResponseDto as ResponseDto,
} from './GetCitiesByUfDto'
import {
  AppError,
  Either,
  left,
  Result,
  right,
  UseCase,
} from '../../../../../shared/core'
import { GetCitiesByUfErrors as Errors } from './GetCitiesByUfErrors'
import { Uf } from '../../../../../shared/domain/creators'
import { ILocationService } from '../../../../../shared/domain/services'

type Failure = Errors.ValidationError | AppError.UnexpectedError
type Success = Result<ResponseDto>
type Response = Either<Failure, Success>

class GetCitiesByUfUseCase implements UseCase<RequestDto, Promise<Response>> {
  constructor(private locationService: ILocationService) {}

  async execute(dto: RequestDto): Promise<Response> {
    try {
      const ufOrError = Uf.create<RequestDto>(dto.uf, {
        propName: 'uf',
        required: true,
      })
      if (ufOrError.isFailure) {
        return left(new Errors.ValidationError(ufOrError.error as string))
      }

      const uf = ufOrError.value

      const cities = await this.locationService.getCitiesByUF(uf.value)

      const responseDto = {
        data: cities.sort(),
      }

      return right(Result.ok<ResponseDto>(responseDto))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}

export { GetCitiesByUfUseCase }
