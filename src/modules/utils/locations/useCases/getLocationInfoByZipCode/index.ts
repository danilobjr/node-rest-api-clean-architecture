import { GetLocationInfoByZipCodeUseCase } from './GetLocationInfoByZipCodeUseCase'
import { GetLocationInfoByZipCodeController } from './GetLocationInfoByZipCodeController'
import { LocationService } from '../../../../../shared/domain/services'

const locationService = new LocationService()
const useCase = new GetLocationInfoByZipCodeUseCase(locationService)
const controller = new GetLocationInfoByZipCodeController(useCase)

export { controller }
