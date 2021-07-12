import { MongooseUserRepo } from '../../../modules/users/repos'
import { UserModel } from '../database/mongodb/models'

const userRepo = new MongooseUserRepo(UserModel)

export { userRepo }
