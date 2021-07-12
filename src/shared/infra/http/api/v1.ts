import { Router } from 'express'
import { middleware } from '../middleware'
import { userRouter } from '../../../../modules/users/infra/http/routes'

const router = Router()

router
  .use('/docs', middleware.openApi.serve)
  .get('/docs', middleware.openApi.setup)
  .use('/users', userRouter)

const version = '/v1'

export { version as basePath, router }
