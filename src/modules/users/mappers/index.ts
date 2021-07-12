import { User } from '../../../modules/users/domain/models'
import { AuthenticatedUser } from '../domain/models'

const mapUserToAuthenticatedUser = (user: User): AuthenticatedUser => ({
  _id: user._id,
  name: user.name,
  cellphone: user.cellphone,
  email: user.email,
  gender: user.gender,
  birthday: user.birthday,
  cpf: user.cpf,
  role: user.role,
})

export { mapUserToAuthenticatedUser }
