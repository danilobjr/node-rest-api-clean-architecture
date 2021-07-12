import { UpdateUserUseCase } from './UpdateUserUseCase'
import { UpdateUserController } from './UpdateUserController'
import { userRepo } from '../../../../shared/infra/repos'

const useCase = new UpdateUserUseCase(userRepo)
const controller = new UpdateUserController(useCase)

export { controller }
