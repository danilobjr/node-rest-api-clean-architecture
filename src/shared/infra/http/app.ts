import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { currentApi } from './api'
import { env } from '../../../config'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.app.corsOrigin,
  }),
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(compression())

const { basePath, router } = currentApi
app.use(basePath, router)

export { app }
