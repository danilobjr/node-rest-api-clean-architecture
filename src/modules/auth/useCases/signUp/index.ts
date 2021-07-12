import { SignUpUseCase } from './SignUpUseCase'
import { SignUpController } from './SignUpController'
import { userRepo } from '../../../../shared/infra/repos'

const useCase = new SignUpUseCase(userRepo)
const controller = new SignUpController(useCase)

export { controller }
