type Either<L, R> = Left<L, R> | Right<L, R>

class Left<L, R> {
  readonly value: L

  constructor(value: L) {
    this.value = value
  }

  isLeft(): this is Left<L, R> {
    return true
  }

  isRight(): this is Right<L, R> {
    return false
  }
}

class Right<L, R> {
  readonly value: R

  constructor(value: R) {
    this.value = value
  }

  isLeft(): this is Left<L, R> {
    return false
  }

  isRight(): this is Right<L, R> {
    return true
  }
}

const left = <L, R>(l: L): Either<L, R> => {
  return new Left(l)
}

const right = <L, R>(a: R): Either<L, R> => {
  return new Right<L, R>(a)
}

export { Either, Left, Right, left, right }
