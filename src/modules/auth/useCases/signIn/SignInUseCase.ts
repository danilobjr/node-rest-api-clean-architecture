import {
  SignInDtoRequest as RequestDto,
  SignInDtoResponse as ResponseDto,
} from './SignInDto'
import { SignInErrors } from './SignInErrors'
import {
  AppError,
  UseCase,
  Result,
  Either,
  left,
  right,
} from '../../../../shared/core'
import { Password, Required } from '../../../../shared/domain/creators'
import { IAuthService } from '../../../../shared/domain/services'
import { IUserRepo } from '../../../users/repos'
import { UserLogin } from '../../../users/domain/creators'
import { mapUserToAuthenticatedUser } from '../../../users/mappers'

type Failure = SignInErrors.InvalidCredentialsError | AppError.UnexpectedError
type Success = Result<ResponseDto>
type Response = Either<Failure, Success>

export class SignInUseCase implements UseCase<RequestDto, Promise<Response>> {
  constructor(private userRepo: IUserRepo, private authService: IAuthService) {}

  public async execute(request: RequestDto): Promise<Response> {
    try {
      const cellphoneOrCpfOrEmailOrError = Required.create<RequestDto>(
        request.login,
        'login',
      )
      const passwordOrError = Password.create<RequestDto>(request.password, {
        propName: 'password',
        required: true,
      })
      const validationResult = Result.combine([
        cellphoneOrCpfOrEmailOrError,
        passwordOrError,
      ])

      if (validationResult.isFailure) {
        return left(new SignInErrors.InvalidCredentialsError())
      }

      const login = cellphoneOrCpfOrEmailOrError.value
      const password = passwordOrError.value

      const loginProp = UserLogin.getCorrectUserProp(login.value)
      const user = await this.userRepo.findByLoginRetrievingPassword(
        loginProp,
        login.value,
      )
      const userFound = !!user

      if (!userFound) {
        return left(new SignInErrors.InvalidCredentialsError())
      }

      const passwordValid = await Password.compare(
        user.password,
        password.value,
      )
      const passwordFromRequestDoesNotMatchTheUserPassword = !passwordValid

      if (passwordFromRequestDoesNotMatchTheUserPassword) {
        return left(new SignInErrors.InvalidCredentialsError())
      }

      const authenticatedUser = mapUserToAuthenticatedUser(user)

      const accessToken = this.authService.generateAccessToken(
        authenticatedUser,
        request.keepSignedIn,
      )

      const responseDto: ResponseDto = {
        data: {
          authenticatedUser,
          accessToken,
        },
      }

      return right(Result.ok<ResponseDto>(responseDto))
    } catch (error) {
      return left(new AppError.UnexpectedError(error))
    }
  }
}
