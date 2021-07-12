import 'dotenv/config'
import './shared/infra/http/app'
import './shared/infra/database/mongodb'

import { env } from './config'
import { app } from './shared/infra/http/app'
import { processEvents } from './shared/infra/process/events'

console.log('[SERVER] Raising...')
const { host, port, isDevelopment } = env.app

const server = app.listen(port, host, () => {
  const environment = isDevelopment() ? 'DEVELOPMENT' : 'PRODUCTION'
  console.log(`[SERVER] Listening on port ${port} in ${environment} mode`)
})

const closeServer = () =>
  server?.close(() => {
    const exitCode = 1
    process.exit(exitCode)
  })

processEvents.onSomethingWentWrong(closeServer)
