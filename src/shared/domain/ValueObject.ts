type ValueObjectProps = Record<string, unknown>

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structrual property.
 */

export abstract class ValueObject<T extends ValueObjectProps> {
  public props: T

  constructor(props: T) {
    const baseProps = {
      ...props,
    }

    this.props = baseProps
  }

  protected static format<T, R>(formatter: (value: T) => R, propValue: T) {
    return formatter(propValue)
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false
    }
    if (vo.props === undefined) {
      return false
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props)
  }
}
