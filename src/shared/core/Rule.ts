import { Either } from './'

type Rule<T> = {
  validate: (entry: T) => Either<string, Record<string, unknown>>
}

export { Rule }
