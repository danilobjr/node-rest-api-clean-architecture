import { Router } from 'express'
import { controller as listUserController } from '../../useCases/listUsers'
// import { controller as appUpdateUserController } from '../../useCases/app/updateUser'
// import { controller as adminCreateUserController } from '../../useCases/admin/createUser'
// import { controller as adminUpdateUserController } from '../../useCases/admin/updateUser'
// import { controller as adminListUsersController } from '../../useCases/admin/listUsers'
// import { controller as adminDetailsUserController } from '../../useCases/admin/detailsUser'
import { middleware } from '../../../../shared/infra/http/middleware'

const userRouter = Router()

userRouter.get('/', middleware.authorize(), (req, res) =>
  listUserController.execute(req, res),
)
// .patch('/:_id', middleware.authorize(), (req, res) =>
//   appUpdateUserController.execute(req, res),
// )
// .get('/', middleware.authorize('administrador'), (req, res) =>
//   ListUsersController.execute(req, res),
// )
// .get('/:_id', middleware.authorize('administrador'), (req, res) =>
//   adminDetailsUserController.execute(req, res),
// )
// .post('/', middleware.authorize('administrador'), (req, res) =>
//   adminCreateUserController.execute(req, res),
// )
// .patch('/:_id', middleware.authorize('administrador'), (req, res) =>
//   adminUpdateUserController.execute(req, res),
// )

export { userRouter }
