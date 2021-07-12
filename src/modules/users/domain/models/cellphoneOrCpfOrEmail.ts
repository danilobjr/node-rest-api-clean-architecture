import { User } from '.'

export type CellphoneOrCpfOrEmail = keyof Pick<User, 'email' | 'cpf' | 'cellphone'>
