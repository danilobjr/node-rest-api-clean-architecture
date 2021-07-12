import {
  CreateUserRequestDto as RequestDto,
  CreateUserResponseDto as ResponseDto,
} from './CreateUserDto'
import { CreateUserErrors as Errors } from './CreateUserErrors'
import { Either, Result, left, right } from '../../../../../shared/core'
import { AppError, UseCase } from '../../../../../shared/core'
import { IUserRepo } from '../../../repos'
import {
  UserName,
  UserBirthday,
  UserGender,
  UserCpf,
  UserCellphone,
  UserRole,
  UserPassword,
  UserPasswordConfirmation,
} from '../../../domain/creators'
import { Gender, Role } from '../../../domain/models'
import { Email, ZipCode } from '../../../../../shared/domain/creators'

type Failure =
  | Errors.ValidationError
  | Errors.UniqueUserError
  | AppError.UnexpectedError

type Success = Result<ResponseDto>

type Response = Either<Failure, Success>

class CreateUserUseCase implements UseCase<RequestDto, Promise<Response>> {
  constructor(private repo: IUserRepo) {}

  async execute(request: RequestDto): Promise<Response> {
    const nameOrError = UserName.create(request.name)
    const birthdayOrError = UserBirthday.create(request.birthday)
    const genderOrError = UserGender.create(request.gender)
    const cpfOrError = UserCpf.create(request.cpf)
    const cellphoneOrError = UserCellphone.create(request.cellphone)
    const emailOrError = Email.create<RequestDto>(request.email, {
      propName: 'email',
    })
    const zipCodeOrError = ZipCode.create<RequestDto>(request.zipCode, {
      propName: 'zipCode',
    })
    const roleOrError = UserRole.create('administrador')
    const passwordOrError = UserPassword.create(request.password)

    // TODO remove this and put its logic inside UserPassword.create
    // with params (request.password, request.passwordConfirmation)
    const passwordConfirmationOrError = UserPasswordConfirmation.create(
      request.passwordConfirmation,
      request.password,
    )

    const dtoResult = Result.combine([
      nameOrError,
      birthdayOrError,
      genderOrError,
      cpfOrError,
      cellphoneOrError,
      emailOrError,
      zipCodeOrError,
      passwordOrError,
      roleOrError,
      passwordConfirmationOrError,
    ])

    if (dtoResult.isFailure) {
      return left(new Errors.ValidationError(dtoResult.error as string))
    }

    const name = nameOrError.value
    const birthday = birthdayOrError.value
    const gender = genderOrError.value
    const cpf = cpfOrError.value
    const cellphone = cellphoneOrError.value
    const email = emailOrError.value
    const zipCode = zipCodeOrError.value
    const role = roleOrError.value
    const password = passwordOrError.value

    try {
      const userAlreadyExists = await this.repo.findByCellphoneOrEmailOrCpf(
        cellphone.value,
        email.value,
        cpf.value,
      )

      if (userAlreadyExists) {
        let foundBy = {
          propName: '',
          value: '',
        }

        if (userAlreadyExists.cellphone === cellphone.value) {
          foundBy = { propName: 'cellphone', value: cellphone.value }
        }

        if (userAlreadyExists.email === email.value) {
          foundBy = { propName: 'email', value: email.value }
        }

        if (userAlreadyExists.cpf === cpf.value) {
          foundBy = { propName: 'cpf', value: cpf.value }
        }

        return left(new Errors.UniqueUserError(foundBy.propName, foundBy.value))
      }

      const hashedPassword = await password.toHashed()

      // FIXME not sending email when user is created
      const createdUser = await this.repo.create({
        name: name.value,
        birthday: birthday.value,
        gender: gender.value as Gender,
        cpf: cpf.value,
        cellphone: cellphone.value,
        email: email.value,
        role: role.value as Role,
        password: hashedPassword,
        address: {
          zipCode: zipCode.value,
        },
      })

      const responseDto: ResponseDto = {
        data: {
          createdUser,
        },
      }

      return right(Result.ok<ResponseDto>(responseDto))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}

export { CreateUserUseCase }
