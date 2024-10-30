import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { get, isNil, isEmpty } from 'lodash';

export class ResponseObject<T> {
  code?: string;

  message?: string;

  data?: T;

  meta?: any;
}
const defaultStatus = 400;

@Injectable()
export class ResponseService {
  static json<T>(
    res: Response,
    statusOrError: number | Error,
    message?: string,
    data?: Record<string, unknown> | Array<Record<string, unknown>> | T,
    meta?: any,
    code?: string,
  ): void {
    const error = statusOrError instanceof Error ? statusOrError : null;

    const responseObj: ResponseObject<typeof data> = {};
    responseObj.message = message;

    let status = statusOrError;

    if (error) {
      const errorObj = statusOrError as Error;
      responseObj.message = message || errorObj.message;
      status = get(errorObj, 'status', defaultStatus);
    }

    if (!isNil(data)) {
      responseObj.data = data;
    }
    if (!isNil(meta)) {
      responseObj.meta = meta;
    }
    if (!isEmpty(code)) {
      responseObj.code = code;
    }

    const statusCode = status as number;
    res.status(statusCode).send(responseObj);
  }
}
