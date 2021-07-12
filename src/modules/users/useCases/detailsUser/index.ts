import { userRepo } from '../../../../shared/infra/repos'
import { DetailsUserController } from './DetailsUserController'
import { DetailsUserUseCase } from './DetailsUserUseCase'

const useCase = new DetailsUserUseCase(userRepo)
const controller = new DetailsUserController(useCase)

export { controller }
