import mongoose from 'mongoose'
import { processEvents } from '../../process/events'
import { env } from '../../../../config'

const { user, password, host, port, name } = env.mongo

const uri = `mongodb://${user}:${password}@${host}:${port}/${name}?authSource=admin`

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .catch((error) => {
    console.log(
      "[MONGOOSE] ERROR: Couldn't connect to remote instance of MongoDB",
    )
    console.error(error)
  })

mongoose.connection.on('connecting', () => {
  console.info('[MONGOOSE] Connecting...')
})

mongoose.connection.on('connected', () => {
  console.info('[MONGOOSE] Connected')
})

processEvents.onSomethingWentWrong(mongoose.connection.close)
