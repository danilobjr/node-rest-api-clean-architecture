import { AuthenticatedUser } from '../../../../modules/users/domain/models'

interface IAuthService {
  generateAccessToken: (
    authenticatedUser: AuthenticatedUser,
    keepUserSignedIn?: boolean,
  ) => string
  verifyToken: (token: string) => Promise<AuthenticatedUser>
}

export { IAuthService }
