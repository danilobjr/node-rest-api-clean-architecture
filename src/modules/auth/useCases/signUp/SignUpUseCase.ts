import { SignUpRequestDto as RequestDto } from './SignUpDto'
import { SignUpErrors as Errors } from './SignUpErrors'
import {
  AppError,
  UseCase,
  Result,
  Either,
  left,
  right,
} from '../../../../shared/core'
import {
  BrazilianCellphone,
  Cpf,
  Datetime,
  Email,
  OneOf,
  Password,
  Required,
  ZipCode,
} from '../../../../shared/domain/creators'
import { IUserRepo } from '../../../users/repos'
import { Gender, Role, roles, User } from '../../../users/domain/models'
import { UserPasswordConfirmation } from '../../../users/domain/creators'

class UserWithThatPhoneExistsButIsInactive {
  constructor(public readonly message: string) {}
}

type Failure =
  | Errors.ValidationError
  | Errors.UniqueUserError
  | AppError.UnexpectedError
type Success = Result<void>
type Response = Either<Failure, Success>

class SignUpUseCase implements UseCase<RequestDto, Promise<Response>> {
  constructor(private userRepo: IUserRepo) {}

  async execute(requestDto: RequestDto): Promise<Response> {
    try {
      const nameOrError = Required.create<RequestDto>(requestDto.name, 'name')
      const birthdayOrError = Datetime.create<RequestDto>(requestDto.birthday, {
        propName: 'birthday',
        required: true,
        format: 'dd/MM/yyyy',
        shouldBeOnPast: true,
      })
      const genderOrError = OneOf.create<RequestDto>(roles, requestDto.gender, {
        propName: 'role',
        required: true,
      })
      const cpfOrError = Cpf.create<RequestDto>(requestDto.cpf, {
        propName: 'cpf',
      })
      const cellphoneOrError = BrazilianCellphone.create<RequestDto>(
        requestDto.cellphone,
        {
          propName: 'cellphone',
          required: true,
        },
      )
      const emailOrError = Email.create<RequestDto>(requestDto.email, {
        propName: 'email',
      })
      const zipCodeOrError = ZipCode.create<RequestDto>(requestDto.zipCode, {
        propName: 'zipCode',
      })
      const passwordOrError = Password.create<RequestDto>(requestDto.password, {
        propName: 'password',
        required: true,
      })

      // TODO remove this and put its logic inside UserPassword.create
      // with params (request.password, request.passwordConfirmation)
      const passwordConfirmationOrError = UserPasswordConfirmation.create(
        requestDto.passwordConfirmation,
        requestDto.password,
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
      const defaultSignupRole: Role = 'free'
      const password = passwordOrError.value

      const userAlreadyExists =
        await this.userRepo.findOneByCellphoneOrEmailOrCpf(
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
      const newUser: User = {
        name: name.value,
        birthday: birthday.value,
        gender: gender.value as Gender,
        cpf: cpf.value,
        cellphone: cellphone.value,
        email: email.value,
        address: { zipCode: zipCode.value },
        role: defaultSignupRole,
        password: hashedPassword,
      }

      return right(Result.ok())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}

export { SignUpUseCase, UserWithThatPhoneExistsButIsInactive }
