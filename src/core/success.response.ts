import { Response } from "express";
import { StatusCodes } from "http-status-codes";

enum ReasonStatusCode {
  CREATED = "Created!",
  OK = "Success",
}

interface SuccessResponseOptions {
  message: string;
  statusCode?: number;
  reasonStatusCode?: string;
  metadata: any; // TODO: fix any
}

interface CreatedResponseOptions extends SuccessResponseOptions {
  options?: object;
}

class SuccessResponse {
  message: string;
  status: number;
  metadata: object;

  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }: SuccessResponseOptions) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res: Response, _headers: object = {}) {
    return res.status(this.status).json(this);
  }
}

class OkResponse extends SuccessResponse {
  constructor({ message, metadata }: SuccessResponseOptions) {
    super({
      message,
      metadata,
    });
  }
}

class CreatedResponse extends SuccessResponse {
  options?: object;

  constructor({ message, metadata, options = {} }: CreatedResponseOptions) {
    super({
      message,
      statusCode: StatusCodes.CREATED,
      reasonStatusCode: ReasonStatusCode.CREATED,
      metadata,
    });
    this.options = options;
  }
}

export { OkResponse, CreatedResponse };
