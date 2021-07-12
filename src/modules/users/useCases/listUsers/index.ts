import { ListUsersController } from './ListUsersController'
import { ListUsersUseCase } from './ListUsersUseCase'
import { userRepo } from '../../../../shared/infra/repos'

const useCase = new ListUsersUseCase(userRepo)
const controller = new ListUsersController(useCase)

export { controller }
