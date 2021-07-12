import DOMPurify from 'isomorphic-dompurify'
import { DateTime } from 'luxon'
import {
  concat,
  converge,
  head,
  init,
  join,
  last,
  not,
  pipe,
  replace,
  split,
  tail,
  toLower,
  toUpper,
} from 'ramda'
import validator from 'validator'

const TextUtils = {
  sanitize(unsafeText: string): string {
    return DOMPurify.sanitize(unsafeText)
  },

  isDate(format: string, date: string) {
    return DateTime.fromFormat(date, format).isValid
  },

  createRandomNumericString(numberDigits: number): string {
    const chars = '0123456789'
    let value = ''

    for (let i = numberDigits; i > 0; --i) {
      value += chars[Math.round(Math.random() * (chars.length - 1))]
    }

    return value
  },

  extractFileNameFromUrl(url: string): string {
    return pipe(split('/'), last)(url) as string
  },

  isNotNumeric: pipe(validator.isNumeric, not),

  encodeUrl: (url: string) => {
    const splitedUrl = url.split('/')
    const protocolAndDomain = init(splitedUrl)
    const encodedFileName = pipe(last, encodeURIComponent)(splitedUrl)
    const joinUrlPiecesAndReplaceEncodedSpacesWithPlusSign = pipe(
      join('/'),
      replace(/%20/g, '+'),
    )
    const encodedUrl = joinUrlPiecesAndReplaceEncodedSpacesWithPlusSign([
      ...protocolAndDomain,
      encodedFileName,
    ])

    return encodedUrl
  },

  firstWord: pipe<string, string[], string>(split(' '), head),

  capitalize: (text: string) => {
    const headUpper = pipe(head, toUpper)
    const tailLower = pipe<string, string, string>(tail, toLower)
    return converge(concat, [headUpper, tailLower])(text)
  },
}

export { TextUtils }
