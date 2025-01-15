import { Middleware, controller } from "@/infra/controller";
import { InternalError } from "@/infra/error";
import { HttpStatusCode } from "@/infra/httpStatusCode";
import { Store } from "@/models/store.model";
import { Store as TStore } from "@prisma/client";

type StoreProps = { stores: Partial<TStore>[] };

const handleGetStoreList: Middleware<StoreProps> = async (_, ctx, next) => {
  const stores = await Store.findMany();
  ctx.stores = stores;

  if (!stores.length) {
    throw new InternalError({
      message: "Não foi possível encontrar a lista de lojas.",
      statusCode: HttpStatusCode.NOT_FOUND,
    });
  }

  await next();
};

const getStoreList: Middleware<StoreProps> = async (_, ctx) => {
  return Response.json(ctx, { status: HttpStatusCode.FOUND });
};

export const GET = controller(handleGetStoreList, getStoreList);
