import { KeyOf } from '../../../utils'

type CreatorOptions<T extends object> = {
  propName: KeyOf<T>
  required?: boolean
}

export { CreatorOptions }
