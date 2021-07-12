import * as express from 'express'
import { httpStatusCode } from '../utils/httpStatusCode'

export abstract class BaseController {
  protected abstract executeImpl(
    req: express.Request,
    res: express.Response,
  ): Promise<void | unknown>

  public async execute(req: express.Request, res: express.Response): Promise<void> {
    try {
      await this.executeImpl(req, res)
    } catch (err) {
      console.log(`[BaseController]: Uncaught controller error`)
      console.log(err)
      this.fail(res, 'Ocorreu um erro inesperado')
    }
  }

  public static jsonResponse(res: express.Response, code: number, message: string) {
    return res.status(code).json({ message })
  }

  public accepted<T>(res: express.Response, dto?: T) {
    this.sendResponseIfDto(res, httpStatusCode.accepted.code, dto)
  }

  public ok<T>(res: express.Response, dto?: T) {
    this.sendResponseIfDto(res, httpStatusCode.ok.code, dto)
  }

  public created<T>(res: express.Response, dto?: T) {
    this.sendResponseIfDto(res, httpStatusCode.created.code, dto)
  }

  public badRequest(res: express.Response, message?: string) {
    const { code, name: statusName } = httpStatusCode.badRequest
    return BaseController.jsonResponse(res, code, message || statusName)
  }

  public unauthorized(res: express.Response, message?: string) {
    const { code, name: statusName } = httpStatusCode.unauthorized
    return BaseController.jsonResponse(res, code, message || statusName)
  }

  public noContent(res: express.Response) {
    const { code } = httpStatusCode.noContent
    return res.sendStatus(code)
  }

  public paymentRequired(res: express.Response, message?: string) {
    const { code, name: statusName } = httpStatusCode.paymentRequired
    return BaseController.jsonResponse(res, code, message || statusName)
  }

  public forbidden(res: express.Response, message?: string) {
    const { code, name: statusName } = httpStatusCode.forbidden
    return BaseController.jsonResponse(res, code, message || statusName)
  }

  public notFound(res: express.Response, message?: string) {
    const { code, name: statusName } = httpStatusCode.notFound
    return BaseController.jsonResponse(res, code, message || statusName)
  }

  public conflict(res: express.Response, message?: string) {
    const { code, name: statusName } = httpStatusCode.conflict
    return BaseController.jsonResponse(res, code, message || statusName)
  }

  public unprocessableEntity(res: express.Response, message?: string) {
    const { code, name: statusName } = httpStatusCode.unprocessableEntity
    return BaseController.jsonResponse(res, code, message || statusName)
  }

  public tooMany(res: express.Response, message?: string) {
    const { code, name: statusName } = httpStatusCode.tooManyRequests
    return BaseController.jsonResponse(res, code, message || statusName)
  }

  public fail(res: express.Response, error: Error | string) {
    return res.status(httpStatusCode.internalServerError.code).json({
      message: error.toString(),
    })
  }

  private sendResponseIfDto<T>(res: express.Response, statusCode: number, dto: T) {
    if (!!dto) {
      res.type('application/json')
      return res.status(statusCode).json(dto)
    } else {
      // FIXME res.status(statusCode).json({ message: getStatusCodeName(statusCode) })
      // res.type('application/json')
      return res.sendStatus(statusCode)
    }
  }
}
