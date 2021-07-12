import { Router } from 'express'
import { middleware } from '../../../../../shared/infra/http/middleware'
import { controller as getCitiesByUfController } from '../../useCases/getCitiesByUF'
import { controller as getLocationInfoByZipCodeController } from '../../useCases/getLocationInfoByZipCode'

const utilsLocationsRouter = Router()
  .get('/shared/:uf/cities', middleware.authorize(), (req, res) =>
    getCitiesByUfController.execute(req, res),
  )
  .get('/shared/:zipCode/info', middleware.authorize(), (req, res) =>
    getLocationInfoByZipCodeController.execute(req, res),
  )

export { utilsLocationsRouter }
