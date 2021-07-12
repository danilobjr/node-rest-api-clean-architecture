import { SignInUseCase } from './SignInUseCase'
import { SignInController } from './SignInController'
import { userRepo } from '../../../../../shared/infra/repos'
import { JwtService } from '../../../../../shared/domain/services'

const authService = new JwtService()
const useCase = new SignInUseCase(userRepo, authService)
const controller = new SignInController(useCase)

export { controller }
