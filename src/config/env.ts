const envVar = (variable: string) => process.env[variable]

const app = {
  nodeEnv: envVar('NODE_ENV') || 'local',
  host: envVar('SERVER_HOST') || '0.0.0.0',
  port: Number(envVar('SERVER_PORT') || '80'),
  corsOrigin: envVar('CORS_ORIGIN') || '*',
  timezone: envVar('TIMEZONE'),
  isDevelopment: () => envVar('NODE_ENV') === 'development',
}

const jwt = {
  secret: envVar('JWT_SECRET'),
  issuer: envVar('JWT_ISSUER'),
  shortExpiration: envVar('JWT_SHORT_EXPIRATION'),
  longExpiration: envVar('JWT_LONG_EXPIRATION'),
}

const mongo = {
  host: envVar('MONGO_HOST'),
  port: envVar('MONGO_PORT'),
  name: envVar('MONGO_NAME'),
  user: envVar('MONGO_USER'),
  password: envVar('MONGO_PASSWORD'),
}

export { app, jwt, mongo }
