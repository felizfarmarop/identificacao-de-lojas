import { Middleware, controller } from "@/infra/controller";
import { HttpStatusCode } from "@/infra/httpStatusCode";
import { StoreFields } from "@/models/store.model";
import { fieldsSchema, suggestionIdSchema } from "@/models/store.validator";
import { StoreSuggestion } from "@/models/storeSuggestion.model";

type SuggestionDeslikeProps = {
  suggestionId: string;
  field: StoreFields;
};

const validateStoreInput: Middleware<SuggestionDeslikeProps> = async (
  req,
  ctx,
  next
) => {
  const body = (await req.json()) as SuggestionDeslikeProps;

  const cleanedValues: SuggestionDeslikeProps = {
    suggestionId: suggestionIdSchema.parse(body.suggestionId),
    field: fieldsSchema.parse(body.field),
  };

  ctx.field = cleanedValues.field;
  ctx.suggestionId = cleanedValues.suggestionId;

  await next();
};

const deslikeStore: Middleware<SuggestionDeslikeProps> = async (_, ctx) => {
  const suggestion = await StoreSuggestion.deslike(ctx.suggestionId, ctx.field);

  return Response.json(suggestion, { status: HttpStatusCode.OK });
};

export const POST = controller(validateStoreInput, deslikeStore);
