import fetch from 'node-fetch'
import cep, { CEP } from 'cep-promise'
import { State } from '../../../../modules/users/domain/models'
import {
  City,
  LocationInfo,
} from '../../../../modules/utils/locations/domain/models'
import { omit } from 'ramda'

type CityResponse = {
  id: number
  nome: string
}

interface ILocationService {
  getCitiesByUF(uf: State): Promise<City[]>
  getLocationInfoByZipCode(cep: string): Promise<LocationInfo>
}

class LocationService implements ILocationService {
  async getCitiesByUF(uf: State) {
    const cities = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`,
    ).then((response) => response.json() as Promise<CityResponse[]>)

    return cities.map(this.mapToCity)
  }

  async getLocationInfoByZipCode(value: string) {
    const response: CEP = await cep(value)

    const localizationInfo: LocationInfo = {
      ...(omit<CEP, keyof CEP>(['cep', 'service'], response) as any),
      zipCode: response.cep,
    }

    return localizationInfo
  }

  private mapToCity(cityResponse: CityResponse): City {
    return {
      id: String(cityResponse.id),
      name: cityResponse.nome,
    }
  }
}

export { ILocationService, LocationService }
