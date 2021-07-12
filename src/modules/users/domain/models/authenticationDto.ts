import { AuthenticatedUser } from './'

type AuthenticationDto = {
  accessToken: string
  authenticatedUser: AuthenticatedUser
}

export { AuthenticationDto }
