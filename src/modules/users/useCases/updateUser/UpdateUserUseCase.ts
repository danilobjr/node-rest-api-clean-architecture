import {
  UpdateUserRequestDto as RequestDto,
  UpdateUserResponseDto as ResponseDto,
} from './UpdateUserDto'
import { UpdateUserErrors as Errors } from './UpdateUserErrors'
import {
  AppError,
  Either,
  left,
  Result,
  right,
  UseCase,
} from '../../../../shared/core'
import { IUserRepo } from '../../repos'
import { propof } from '../../../../shared/utils'
import { genders, User } from '../../domain/models'
import {
  BrazilianCellphone,
  Cpf,
  Datetime,
  Email,
  OneOf,
  Required,
  ZipCode,
} from '../../../../shared/domain/creators'
import { defaultTo } from 'ramda'

type Failure =
  | Errors.ValidationError
  | Errors.NotFoundUserError
  | AppError.UnexpectedError
type Success = Result<ResponseDto>
type Response = Either<Failure, Success>

class UpdateUserUseCase implements UseCase<RequestDto, Promise<Response>> {
  constructor(private userRepo: IUserRepo) {}

  async execute(dto?: RequestDto): Promise<Response> {
    try {
      const authenticatedUser = dto.authenticatedUser
      const idOrError = Required.create<RequestDto>(dto._id, '_id')

      if (idOrError.isFailure) {
        return left(new Errors.ValidationError(idOrError.error as string))
      }

      const _id = idOrError.value
      const authenticatedUserIsTryingToChangeDataFromAnotherUserThasIsNotHimself =
        _id.value !== authenticatedUser._id
      if (
        authenticatedUserIsTryingToChangeDataFromAnotherUserThasIsNotHimself
      ) {
        return left(new Errors.ForbiddenError())
      }

      const nameOrError = Required.create<RequestDto>(dto.name, 'name')
      const genderOrError = OneOf.create<RequestDto>(genders, dto.gender, {
        propName: 'gender',
        required: true,
      })
      const birthdayOrError = Datetime.create<RequestDto>(dto.birthday, {
        propName: 'birthday',
        format: 'dd/MM/yyyy',
        required: true,
        shouldBeOnPast: true,
      })
      const cellphoneOrError = BrazilianCellphone.create<RequestDto>(
        dto.cellphone,
        { propName: 'cellphone' },
      )
      const emailOrError = Email.create<RequestDto>(dto.email, {
        propName: 'email',
        required: true,
      })
      const cpfOrError = Cpf.create<RequestDto>(dto.cpf, {
        propName: 'cpf',
      })
      const addressZipCodeOrError = ZipCode.create<RequestDto>(
        dto.addressZipCode,
        {
          propName: 'addressZipCode',
        },
      )

      const validationResult = Result.combine([
        nameOrError,
        genderOrError,
        birthdayOrError,
        cellphoneOrError,
        emailOrError,
        cpfOrError,
        addressZipCodeOrError,
      ])

      if (validationResult.isFailure) {
        return left(
          new Errors.ValidationError(validationResult.error as string),
        )
      }

      const name = nameOrError.value
      const gender = genderOrError.value
      const birthday = birthdayOrError.value
      const cellphone = cellphoneOrError.value
      const email = emailOrError.value
      const cpf = cpfOrError.value
      const addressZipCode = addressZipCodeOrError.value

      const userFound = await this.userRepo.findById(_id.value)
      if (_id && !userFound) {
        return left(new Errors.NotFoundUserError(_id))
      }
      const original = userFound

      const foundDocumentsByUniqueFields =
        await this.userRepo.findByCellphoneOrEmailOrCpf(
          cellphone.value,
          email.value,
          cpf.value,
        )

      const alreadyExistsAnotherUserWithThisUniqueData =
        foundDocumentsByUniqueFields?.some(
          (found) => found._id !== original._id,
        )
      if (alreadyExistsAnotherUserWithThisUniqueData) {
        const itHasSameCellphone = foundDocumentsByUniqueFields.some(
          (found) => found.cellphone === cellphone.value,
        )
        if (itHasSameCellphone) {
          return left(
            new Errors.UniqueUserError(
              propof<User>('cellphone'),
              cellphone.value,
            ),
          )
        }

        const itHasSameCpf = foundDocumentsByUniqueFields.some(
          (found) => found.cpf === cpf.value,
        )
        if (itHasSameCpf) {
          return left(
            new Errors.UniqueUserError(propof<User>('cpf'), cpf.value),
          )
        }

        const itHasSameEmail = foundDocumentsByUniqueFields.some(
          (found) => found.email === email.value,
        )
        if (itHasSameEmail) {
          return left(
            new Errors.UniqueUserError(propof<User>('email'), email.value),
          )
        }
      }

      const updatedData: Omit<User, 'password'> = {
        ...original,
        name: name.value,
        gender: gender.value,
        birthday: birthday.value,
        cellphone: cellphone.value,
        email: email.value,
        cpf: cpf.value,
        address: {
          ...defaultTo({}, original?.address),
          zipCode: addressZipCode.value,
        },
      }

      await this.userRepo.update(_id.value, updatedData)

      const responseDto: ResponseDto = { data: updatedData }

      return right(Result.ok(responseDto))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}

export { UpdateUserUseCase }
