import { anyPass, equals, filter, isEmpty, isNil, keys, pipe } from 'ramda'
import { TextUtils } from './TextUtils'

export const logIdentity = (x: unknown) => {
  console.log('[LOG]', x)
  return x
}

export const getEnumKeysAsArray = pipe(keys, filter(TextUtils.isNotNumeric))

export const isBlank = <T>(value: T) =>
  anyPass<T>([isNil, isEmpty, equals('undefined')])(value)

export const stringifyJson = (json) => JSON.stringify(json, null, 2)
