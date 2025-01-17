import { Middleware, controller } from "@/infra/controller";
import { HttpStatusCode } from "@/infra/httpStatusCode";
import { Store } from "@/models/store.model";
import {
  acronymSchema,
  cnpjSchema,
  companyNameSchema,
  tradeNameSchema,
} from "@/models/store.validator";

type CreationStoreSuggestionProps = {
  store: {
    acronym: string;
    cnpj: string;
    companyName: string;
    tradeName: string;
  };
};

const handleCreateSuggestion: Middleware<CreationStoreSuggestionProps> = async (
  _,
  ctx
) => {
  const newStore = await Store.create(ctx.store);

  return Response.json(newStore, { status: HttpStatusCode.CREATED });
};

const validateInputData: Middleware<CreationStoreSuggestionProps> = async (
  req,
  ctx,
  next
) => {
  const inputData = await req.json();

  const cleanValues: CreationStoreSuggestionProps["store"] = {
    acronym: acronymSchema.parse(inputData.acronym),
    cnpj: cnpjSchema.parse(inputData.cnpj),
    companyName: companyNameSchema.parse(inputData.companyName),
    tradeName: tradeNameSchema.parse(inputData.tradeName),
  };

  ctx.store = cleanValues;

  return next();
};

export const POST = controller(validateInputData, handleCreateSuggestion);
