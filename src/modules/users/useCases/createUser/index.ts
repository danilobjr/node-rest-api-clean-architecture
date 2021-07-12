import { CreateUserUseCase } from './CreateUserUseCase'
import { CreateUserController } from './CreateUserController'
import { userRepo } from '../../../../../shared/infra/repos'

const useCase = new CreateUserUseCase(userRepo)
const controller = new CreateUserController(useCase)

export { controller }
