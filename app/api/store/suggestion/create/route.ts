import { Middleware, controller } from "@/infra/controller";
import { HttpStatusCode } from "@/infra/httpStatusCode";
import { StoreSchema } from "@/models/store.validator";
import { Store as TStore } from "@prisma/client";

const handleCreateSuggestion: Middleware<TStore> = async (req) => {
  const data = await req.json();
  const cleanValues = StoreSchema.parse(data);

  // TODO: implementar logica para validação e criação de sugestão de criação de loja
  return Response.json(cleanValues, { status: HttpStatusCode.OK });
};

export const POST = controller(handleCreateSuggestion);
