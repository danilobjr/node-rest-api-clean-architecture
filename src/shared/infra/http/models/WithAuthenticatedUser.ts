import { AuthenticatedUser } from '../../../../modules/users/domain/models'

type WithAuthenticatedUser = {
  authenticatedUser?: AuthenticatedUser
}

export { WithAuthenticatedUser }
