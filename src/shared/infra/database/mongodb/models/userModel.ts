import { model, Document, Schema } from 'mongoose'
import { User } from '../../../../../modules/users/domain/models'

type UserDocument = User & Document

const schema = new Schema(
  {
    name: String,
    birthday: Date,
    gender: String,
    cpf: String,
    cellphone: String,
    email: String,
    role: String,
    password: String,
    address: {
      zipCode: String,
      street: String,
      streetNumber: Number,
      neighborhood: String,
      additionalInfo: String,
      state: String,
      city: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_, ret) {
        delete ret.password
      },
    },
  },
)

const modelName = 'User'
const collectionName = 'users'

const UserModel = model<UserDocument>(modelName, schema, collectionName)

export {
  UserDocument,
  UserModel,
  modelName as mongooseUserModelName,
  collectionName as mongooseUserCollectionName,
}
