const httpStatusCode = {
  ok: {
    name: 'Ok',
    code: 200,
  },
  created: {
    name: 'Created',
    code: 201,
  },
  accepted: {
    name: 'Accepted',
    code: 202,
  },
  noContent: {
    name: 'No Content',
    code: 204,
  },
  badRequest: {
    name: 'Bad Request',
    code: 400,
  },
  unauthorized: {
    name: 'Unauthorized',
    code: 401,
  },
  paymentRequired: {
    name: 'Payment Required',
    code: 402,
  },
  forbidden: {
    name: 'Forbidden',
    code: 403,
  },
  notFound: {
    name: 'Not Found',
    code: 404,
  },
  conflict: {
    name: 'Conflict',
    code: 409,
  },
  unprocessableEntity: {
    name: 'Unprocessable Entity',
    code: 422,
  },
  tooManyRequests: {
    name: 'Too Many Requests',
    code: 429,
  },
  internalServerError: {
    name: 'Internal Server Error',
    code: 500,
  },
}

export { httpStatusCode }
