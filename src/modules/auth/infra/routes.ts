import { Router } from 'express'
import { controller as signInController } from '../useCases/signIn'
import { controller as signUpController } from '../useCases/signUp'

const authRouter = Router()

authRouter
  .post('/sign-up', (req, res) => signUpController.execute(req, res))
  .post('/sign-in', (req, res) => signInController.execute(req, res))

export { authRouter  }
