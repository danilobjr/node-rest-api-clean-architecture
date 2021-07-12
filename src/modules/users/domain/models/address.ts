import { State } from './state'

type Address = {
  zipCode: string
  street?: string
  streetNumber?: number
  neighborhood?: string
  additionalInfo?: string
  state?: State
  city?: string
}

export { Address }
