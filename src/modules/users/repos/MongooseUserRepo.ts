import { isEmpty } from 'ramda'
import { UserDocument } from '../../../shared/infra/database/mongodb/models'
import { BaseRepo, IBaseRepo } from '../../../shared/infra/repos'
import { UserId } from '../domain/creators'
import { CellphoneOrCpfOrEmail, User } from '../domain/models'

type IUserRepo = IBaseRepo<User> & ICustomRepo

interface ICustomRepo {
  findByIdIncludingPasswordOnReturn: (userId: UserId) => Promise<User>
  findByLoginRetrievingPassword: (
    loginProp: CellphoneOrCpfOrEmail,
    loginValue: string,
  ) => Promise<User>
  findOneByCellphoneOrEmailOrCpf: (
    cellphone: string,
    email: string,
    cpf: string,
  ) => Promise<User>
  findByCellphoneOrEmailOrCpf: (
    cellphone: string,
    email: string,
    cpf: string,
  ) => Promise<User[]>
}

class MongooseUserRepo
  extends BaseRepo<User, UserDocument>
  implements ICustomRepo
{
  constructor(model) {
    super(model, {
      sortBy: 'name',
      ordering: 1,
    })
  }

  async findByIdIncludingPasswordOnReturn(userId: UserId) {
    const document = await this.populate(this.model.findById(userId.value))

    if (!document) {
      return null
    }

    document._id = document._id.toString()
    const mappedDocument = this.mapDocumentToEntity(document)
    mappedDocument.password = document.password

    return mappedDocument
  }

  async findByLoginRetrievingPassword(
    loginProp: CellphoneOrCpfOrEmail,
    loginValue: string,
  ) {
    const document = await this.populate(
      this.model.findOne({ [loginProp]: loginValue }),
    )

    if (!document) {
      return null
    }

    document._id = document._id.toString()
    const mappedDocument = this.mapDocumentToEntity(document)
    mappedDocument.password = document.password

    return mappedDocument
  }

  async findOneByCellphoneOrEmailOrCpf(
    cellphone: string,
    email?: string,
    cpf?: string,
  ) {
    let conditions = [] as Record<string, unknown>[]

    if (cellphone) {
      conditions = [{ cellphone }]
    }

    if (email) {
      conditions = [...conditions, { email }]
    }

    if (cpf) {
      conditions = [...conditions, { cpf }]
    }

    const document = await this.model.findOne().or(conditions)

    if (!document) {
      return null
    }

    document._id = document._id.toString()

    return this.mapDocumentToEntity(document)
  }

  async findByCellphoneOrEmailOrCpf(
    cellphone: string,
    email?: string,
    cpf?: string,
  ) {
    let conditions = [] as Record<string, unknown>[]

    if (cellphone) {
      conditions = [{ cellphone }]
    }

    if (email) {
      conditions = [...conditions, { email }]
    }

    if (cpf) {
      conditions = [...conditions, { cpf }]
    }

    const documents = await this.model.find().or(conditions)

    if (!documents || isEmpty(documents)) {
      return null
    }

    return documents.map(this.mapDocumentToEntity)
  }

  mapDocumentToEntity(document): User {
    return {
      _id: document._id.toString(),
      name: document.name,
      gender: document.gender,
      birthday: document.birthday,
      cpf: document.cpf,
      cellphone: document.cellphone,
      email: document.email,
      role: document.role,
      // password: document.password,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      address: {
        zipCode: document.address?.zipCode,
        street: document.address?.street,
        streetNumber: document.address?.streetNumber,
        neighborhood: document.address?.neighborhood,
        additionalInfo: document.address?.additionalInfo,
        state: document.address?.state,
        city: document.address?.city,
      },
    }
  }
}

export { MongooseUserRepo, IUserRepo }
