import { ResponseDto } from '../../../../../shared/domain'

type GetCitiesByUfRequestDto = {
  uf: string
}

type GetCitiesByUfResponseDto = ResponseDto<any[]>

export { GetCitiesByUfRequestDto, GetCitiesByUfResponseDto }
