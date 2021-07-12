import { GetCitiesByUfUseCase } from './GetCitiesByUfUseCase'
import { GetCitiesByUfController } from './GetCitiesByUfController'
import { LocationService } from '../../../../../shared/domain/services'

const locationService = new LocationService()
const useCase = new GetCitiesByUfUseCase(locationService)
const controller = new GetCitiesByUfController(useCase)

export { controller }
