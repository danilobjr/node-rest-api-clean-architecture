import { ResponseDto } from '../../../../../shared/domain'
import { LocationInfo } from '../../domain/models'

type GetLocationInfoByZipCodeRequestDto = {
  zipCode: string
}

type GetLocationInfoByZipCodeResponseDto = ResponseDto<LocationInfo>

export { GetLocationInfoByZipCodeRequestDto, GetLocationInfoByZipCodeResponseDto }
