const roles = ['administrador', 'premium', 'free', 'debtor']
const rolesConst = [...roles] as const
type Role = typeof rolesConst[number]

enum UserRole {
  Administrador = 'administrador',
  Premium = 'premium',
  Free = 'free',
  Debtor = 'debtor',
}

export { Role, roles, UserRole }
