import { trim } from 'ramda'
import { Guard, Result } from '../../core'
import { ValueObject } from '../'
import { propof } from '../../utils'

type UrlProps = {
  value: string
}

export class Url extends ValueObject<UrlProps> {
  get value() {
    return this.props.value
  }

  private constructor(props: UrlProps) {
    super(props)
  }

  public static create<T>(
    urlCandidate: string,
    propName: keyof T,
  ): Result<Url> {
    urlCandidate = String(urlCandidate)

    const notBlankResult = Guard.isNotBlank(propName as string, urlCandidate)
    const urlResult = Guard.isUrl(propName as string, urlCandidate)
    const combineResult = Guard.combine([notBlankResult, urlResult])
    if (!combineResult.succeeded) {
      return Result.fail<Url>(combineResult.message)
    }

    return Result.ok<Url>(new Url({ value: this.format(trim, urlCandidate) }))
  }
}
