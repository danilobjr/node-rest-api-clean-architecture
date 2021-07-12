import { DateTime, Duration, Interval } from 'luxon'
import ms from 'ms'
import { pipe } from 'ramda'

const calculateAgeFromIsoStringDate = (isoStringDate: string) => {
  const birthday = date(isoStringDate)
  const age = Interval.fromDateTimes(birthday, now())
    .toDuration('years')
    .toFormat('yyy')

  return Number(age)
}

const toStringFormat = (isoStringDate: string) => {
  const newDate = date(isoStringDate)
  const format = DateTime.fromJSDate(newDate).toFormat('dd/MM/yyyy')
  return format
}

const toFormat = (format: string) => (date: Date) =>
  DateTime.fromJSDate(date).toFormat(format)

const toPtBrFormat = (date: Date) => toFormat('dd/MM/yyyy')(date)

// TODO rename this to fromISOStringDate
const date = (isoStringDate: string) => new Date(isoStringDate)

/**
 * Converts an specific duration to serveral formats
 * @param time Set time using github.com/vercel/ms format
 * @example duractionConverter('15m').toSeconds() // 900
 * @example duractionConverter('3s').toMilliseconds() // 3000
 */
const durationConverter = (time: string) => {
  const milliseconds = ms(time)
  const duration = Duration.fromMillis(milliseconds)

  const toSeconds = () => Number(duration.toFormat('ss'))
  const toMilliseconds = () => milliseconds

  return {
    toMilliseconds,
    toSeconds,
  }
}

const fromFormat = (format: string) => (value: string) =>
  DateTime.fromFormat(value, format)

const fromJSDate = DateTime.fromJSDate

const toUTC = (dateTime: DateTime) => dateTime.toUTC()

const now = () => DateTime.local().toUTC()

type Plus = InstanceType<typeof DateTime>['plus']
type PlusDuration = Parameters<Plus>[0]
const plus = (duration: PlusDuration) => (date: DateTime) => date.plus(duration)
const plusJSDate = (duration: PlusDuration) => (date: Date) =>
  pipe(fromJSDate, plus(duration), toJSDate)(date)

const toJSDate = (dateTime: DateTime) => dateTime.toJSDate()

// FIXME should be renamed to toFirstSecondOfTheDay
const toFirstSecondOfToday = (dateTime: DateTime) =>
  dateTime.set({ hour: 0, minute: 0, second: 0 })

// FIXME should be renamed to toLastSecondOfTheDay
const toLastSecondOfToday = (dateTime: DateTime) =>
  dateTime.set({ hour: 23, minute: 59, second: 59 })

const firstDayOfCurrentMonth = () => DateTime.local().startOf('month')
const lastDayOfCurrentMonth = () => DateTime.local().endOf('month')

export {
  calculateAgeFromIsoStringDate,
  date,
  durationConverter,
  fromFormat,
  fromJSDate,
  now,
  plus,
  plusJSDate,
  toJSDate,
  toFormat,
  toPtBrFormat,
  toStringFormat,
  toFirstSecondOfToday,
  toLastSecondOfToday,
  toUTC,
  firstDayOfCurrentMonth,
  lastDayOfCurrentMonth,
}
