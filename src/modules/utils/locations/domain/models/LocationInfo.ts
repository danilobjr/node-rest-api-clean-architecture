import { CEP } from 'cep-promise'

type LocationInfo = Omit<CEP, 'cep' | 'service'> & {
  zipCode: string
}

export { LocationInfo }
