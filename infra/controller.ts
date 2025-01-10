import { NextRequest } from "next/server";
import { internalErrorHandler } from "@/infra/error";

export type Middleware<C = { [key: string]: unknown }> = (
  req: NextRequest,
  ctx: C,
  next: () => Promise<void>
) => Promise<Response | void>;

export function controller<C = unknown>(
  ...middlewares: Middleware<C>[]
): (req: NextRequest) => Promise<Response> {
  return async (req: NextRequest) => {
    const context: C = {} as C;
    let index = -1;
    let response: Response | undefined;

    async function next() {
      index++;
      if (index < middlewares.length) {
        const currentMiddleware = middlewares[index];
        const result = await currentMiddleware(req, context, next);

        if (result instanceof Response) {
          response = result;
          return;
        }
      }
    }

    try {
      await next();
      if (!response) {
        throw new Error("Sem resposta do controlador");
      }

      return response;
    } catch (error) {
      return internalErrorHandler(error);
    }
  };
}
