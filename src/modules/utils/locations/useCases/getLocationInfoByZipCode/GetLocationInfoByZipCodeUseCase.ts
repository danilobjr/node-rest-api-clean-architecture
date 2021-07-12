import {
  GetLocationInfoByZipCodeRequestDto as RequestDto,
  GetLocationInfoByZipCodeResponseDto as ResponseDto,
} from './GetLocationInfoByZipCodeDto'
import {
  AppError,
  Either,
  left,
  Result,
  right,
  UseCase,
} from '../../../../../shared/core'
import { GetLocationInfoByZipCodeErrors as Errors } from './GetLocationInfoByZipCodeErrors'
import { ZipCode } from '../../../../../shared/domain/creators'
import { ILocationService } from '../../../../../shared/domain/services'

type Failure = Errors.ValidationError | AppError.UnexpectedError
type Success = Result<ResponseDto>
type Response = Either<Failure, Success>

class GetLocationInfoByZipCodeUseCase
  implements UseCase<RequestDto, Promise<Response>> {
  constructor(private locationService: ILocationService) {}

  async execute(dto: RequestDto): Promise<Response> {
    try {
      const zipCodeOrError = ZipCode.create<RequestDto>(dto.zipCode, {
        propName: 'zipCode',
        required: true,
      })
      if (zipCodeOrError.isFailure) {
        return left(new Errors.ValidationError(zipCodeOrError.error as string))
      }

      const zipCode = zipCodeOrError.value

      const locationInfo = await this.locationService.getLocationInfoByZipCode(
        zipCode.value,
      )

      const responseDto: ResponseDto = {
        data: locationInfo,
      }

      return right(Result.ok<ResponseDto>(responseDto))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}

export { GetLocationInfoByZipCodeUseCase }
