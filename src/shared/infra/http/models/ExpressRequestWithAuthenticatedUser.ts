import express from 'express'
import { AuthenticatedUser } from '../../../../modules/users/domain/models'

export interface ExpressRequestWithAuthenticatedUser extends express.Request {
  authenticatedUser: AuthenticatedUser
}
