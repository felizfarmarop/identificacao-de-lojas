import { v4 as uuid } from "uuid";
import { HttpStatusCode } from "./httpStatusCode";
import { ZodError } from "zod";

interface InternalErrorProps {
  key?: string;
  message: string;
  context?: unknown;
  stack?: string;
  errorId?: string;
  requestId?: string;
  statusCode?: number;
}

export class InternalError extends Error {
  key?: string;
  message: string;
  context?: unknown;
  stack?: string;
  errorId?: string;
  requestId?: string;
  statusCode?: number;

  constructor(props: InternalErrorProps) {
    super();
    this.message = props.message;
    this.errorId = props.errorId || uuid();
    this.statusCode = props.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    this.requestId = props.requestId;
    this.stack = props.stack;
    this.key = props.key;
    this.context = props.context;
  }
}

export async function internalErrorHandler(error: unknown): Promise<Response> {
  if (error instanceof InternalError) {
    return sendErrorResponse(error);
  } else if (error instanceof ZodError) {
    const internalError = new InternalError({
      message: error.errors[0].message,
    });
    return sendErrorResponse(internalError);
  } else if (error instanceof Error) {
    const internalError = new InternalError({
      message: error.message,
      stack: error.stack!,
    });
    return sendErrorResponse(internalError);
  }

  const genericError = new InternalError({
    message: "Um erro desconhecido aconteceu",
  });
  return sendErrorResponse(genericError);

  function sendErrorResponse(error: InternalError) {
    const publicErrorObject = {
      key: error.key,
      message: error.message,
      errorId: error.errorId,
      requestId: error.requestId,
      statusCode: error.statusCode,
      context: error.context,
    };

    return Response.json(publicErrorObject, {
      status: error.statusCode,
    });
  }
}
