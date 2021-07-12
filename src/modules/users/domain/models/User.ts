import { Entity, TimeStamp } from '../../../../shared/domain'
import { Address } from './address'
import { Gender } from './gender'
import { Role } from './role'

type User = Entity &
  TimeStamp & {
    name: string
    birthday: Date
    gender?: Gender
    cellphone: string
    email?: string
    cpf?: string
    role?: Role
    password?: string
    address?: Address
  }

export { User }
