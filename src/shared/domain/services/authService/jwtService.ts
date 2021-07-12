import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from '../../../../config'
import { AuthenticatedUser } from '../../../../modules/users/domain/models'
import { IAuthService } from './IAuthService'

class JwtService implements IAuthService {
  generateAccessToken(
    authenticatedUser: AuthenticatedUser,
    keepUserSignedIn = false,
  ) {
    const defaultOptions: SignOptions = {
      issuer: env.jwt.issuer,
      expiresIn: env.jwt.shortExpiration,
    }

    const options: SignOptions = keepUserSignedIn
      ? { ...defaultOptions, expiresIn: env.jwt.longExpiration }
      : defaultOptions

    const payload = authenticatedUser

    return jwt.sign(payload, env.jwt.secret, options)
  }

  verifyToken(token: string): Promise<AuthenticatedUser> {
    return new Promise((resolve) => {
      jwt.verify(token, env.jwt.secret, (error, decoded: AuthenticatedUser) => {
        if (error) return resolve(null)

        const authenticatedUserInfo = decoded
        return resolve(authenticatedUserInfo)
      })
    })
  }
}

export { JwtService }
