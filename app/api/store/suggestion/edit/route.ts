import { Middleware, controller } from "@/infra/controller";
import { HttpStatusCode } from "@/infra/httpStatusCode";
import {
  acronymSchema,
  cnpjSchema,
  companyNameSchema,
  fieldsSchema,
  storeIdSchema,
  tradeNameSchema,
} from "@/models/store.validator";
import { StoreSuggestion } from "@/models/storeSuggestion.model";

import { StoreSuggestion as TStore } from "@prisma/client";

type StoreProps = { store: Partial<TStore> };

const validateStoreInput: Middleware<StoreProps> = async (req, ctx, next) => {
  const body = (await req.json()) as {
    storeId: string;
    field: "acronym" | "cnpj" | "companyName" | "tradeName";
    value: string;
  };

  const validators = {
    acronym: () => acronymSchema.parse(body.value),
    cnpj: () => cnpjSchema.parse(body.value),
    companyName: () => companyNameSchema.parse(body.value),
    tradeName: () => tradeNameSchema.parse(body.value),
  };

  const validator = validators[fieldsSchema.parse(body.field)];

  const cleanedValues: Partial<TStore> = {
    storeId: storeIdSchema.parse(body.storeId),
  };

  cleanedValues[body.field] = {
    value: validator(),
    votes: 0,
  };

  ctx.store = cleanedValues;

  await next();
};

const updateStore: Middleware<StoreProps> = async (_, ctx) => {
  await StoreSuggestion.create({
    storeId: ctx.store.storeId!,
    ...ctx.store,
  });

  return Response.json(ctx, { status: HttpStatusCode.CREATED });
};

export const POST = controller(validateStoreInput, updateStore);
