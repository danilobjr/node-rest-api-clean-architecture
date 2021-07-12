import { withComposedCallbacks } from '../../utils'

const onSomethingWentWrong = withComposedCallbacks(({ runCallbacks }) => {
  const exitProcess = () => {
    const exitCode = 1
    process.exit(exitCode)
  }

  const ctrlCEvent = 'SIGINT'

  process.on(ctrlCEvent, () => {
    console.log('[SERVER] Closing server...')
    runCallbacks()
    exitProcess()
  })

  process.on('unhandledRejection', (error: Error) => {
    console.log('[SERVER] UNHANDLED REJECTION! Shutting down...')
    // console.log(error.name, error.message)
    console.log(error)
    runCallbacks()
    exitProcess()
  })

  process.on('uncaughtException', (error: Error) => {
    console.log('[SERVER] UNCAUGHT EXCEPTION! Shutting down...')
    // console.log(error.name, error.message)
    console.log(error)
    runCallbacks()
    exitProcess()
  })
})

const processEvents = {
  onSomethingWentWrong,
}

export { processEvents }
