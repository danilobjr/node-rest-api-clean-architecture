import { compose } from 'ramda'
import { stringifyJson } from './ObjectUtils'

type Callback = () => void
type Callbacks = Callback[]
type PublicResources = {
  addCallback: (callback: Callback) => void
  runCallbacks: () => unknown
}

const withComposedCallbacks = (
  callback: (publicResources: PublicResources) => void,
) => {
  let callbacks: Callbacks = []

  const addCallback = (newCallback: Callback) => {
    callbacks = [...callbacks, newCallback]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const runComposedCallbacks = () => (compose as any)(...callbacks)

  callback({
    addCallback,
    runCallbacks: runComposedCallbacks,
  })

  return (callback: () => void) => {
    callbacks = [...callbacks, callback]
  }
}

const logJob = (prefix: string) => (text: string) =>
  console.log(`[JOB - ${prefix?.toUpperCase()}]`, text)

const logErrorJob = (prefix: string) => (error: string | Error) =>
  console.error(
    `[JOB - ${prefix?.toUpperCase()}] Error`,
    typeof error === 'string' ? error : stringifyJson(error),
  )

export { withComposedCallbacks, logJob, logErrorJob }
