import { StatusCodes } from "http-status-codes";

enum ReasonStatusCode {
  CONFLICT = "Conflict Error",
  BAD_REQUEST = "Bad Request Error",
  NOT_FOUND = "Not Found",
}

class ErrorResponse extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.CONFLICT) {
    super(message, StatusCodes.CONFLICT);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.BAD_REQUEST) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.NOT_FOUND) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

export { ConflictRequestError, BadRequestError, NotFoundError };
