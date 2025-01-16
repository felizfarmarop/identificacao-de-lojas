import { Middleware, controller } from "@/infra/controller";
import { HttpStatusCode } from "@/infra/httpStatusCode";
import { StoreFields } from "@/models/store.model";
import { fieldsSchema, suggestionIdSchema } from "@/models/store.validator";
import { StoreSuggestion } from "@/models/storeSuggestion.model";

type SuggestionLikeProps = {
  suggestionId: string;
  field: StoreFields;
};

const validateStoreInput: Middleware<SuggestionLikeProps> = async (
  req,
  ctx,
  next
) => {
  const body = (await req.json()) as SuggestionLikeProps;

  const cleanedValues: SuggestionLikeProps = {
    suggestionId: suggestionIdSchema.parse(body.suggestionId),
    field: fieldsSchema.parse(body.field),
  };

  ctx.field = cleanedValues.field;
  ctx.suggestionId = cleanedValues.suggestionId;

  await next();
};

const likeStore: Middleware<SuggestionLikeProps> = async (_, ctx) => {
  const suggestion = await StoreSuggestion.like(ctx.suggestionId, ctx.field);

  return Response.json(suggestion, { status: HttpStatusCode.OK });
};

export const POST = controller(validateStoreInput, likeStore);
