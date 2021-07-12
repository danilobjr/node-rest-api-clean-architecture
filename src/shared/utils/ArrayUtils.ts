import { ascend, descend, map, pipe, prop, sort } from 'ramda'

type WithSort<T> = {
  sort: number
  value: T
}

const shuffle = <T>(array: T[]) =>
  pipe<T[], WithSort<T>[], WithSort<T>[], T[]>(
    map((i) => ({ sort: Math.random(), value: i })),
    sort((a, b) => a.sort - b.sort),
    map((i) => i.value),
  )(array)

const createArray = (startingNumber: number, length: number) =>
  Array.from(Array(length).keys()).map((index) => index + startingNumber)

const sortBy = <T>(
  propName: keyof T & string,
  ordering: typeof ascend | typeof descend = ascend,
) => sort(ordering(prop(propName)))

const toIterator = (items: any[]) => items[Symbol.iterator]()

export { createArray, shuffle, sortBy, toIterator }
