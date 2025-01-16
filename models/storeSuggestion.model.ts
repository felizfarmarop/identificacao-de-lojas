import database from "@/infra/database";
import { type StoreSuggestion as TStore } from "@prisma/client";
import {
  storeIdSchema,
  suggestionFieldAcronymSchema,
  suggestionFieldCnpjSchema,
  suggestionFieldCompanyNameSchema,
  suggestionFieldTradeNameSchema,
} from "./store.validator";
import { ZodError } from "zod";
import { Store, StoreFields } from "./store.model";
import { InternalError } from "@/infra/error";
import { HttpStatusCode } from "@/infra/httpStatusCode";

type CreateStoreSuggestionProps = Partial<TStore> & {
  storeId: string;
};

export class StoreSuggestion {
  acronym?: TStore["acronym"];
  tradeName?: TStore["tradeName"];
  companyName?: TStore["companyName"];
  cnpj?: TStore["cnpj"];

  constructor(props: TStore) {
    this.acronym = props.acronym;
    this.tradeName = props.tradeName;
    this.companyName = props.companyName;
    this.cnpj = props.cnpj;
  }

  static async create({ storeId, ...props }: CreateStoreSuggestionProps) {
    let result = props;

    try {
      storeId = storeIdSchema.parse(storeId);
      result = {
        acronym: props.acronym
          ? suggestionFieldAcronymSchema.parse(props.acronym)
          : undefined,

        cnpj: props.cnpj
          ? suggestionFieldCnpjSchema.parse(props.cnpj)
          : undefined,
        companyName: props.companyName
          ? suggestionFieldCompanyNameSchema.parse(props.companyName)
          : undefined,
        tradeName: props.tradeName
          ? suggestionFieldTradeNameSchema.parse(props.tradeName)
          : undefined,
      };
    } catch (err) {
      if (err instanceof ZodError) {
        throw err;
      }
    }

    await database.storeSuggestion.create({
      data: {
        storeId,
        acronym: result.acronym,
        cnpj: result.cnpj,
        companyName: result.companyName,
        tradeName: result.tradeName,
      },
    });
  }

  static async like(suggestionId: string, field: StoreFields) {
    const suggestion = await database.storeSuggestion.findUnique({
      where: { id: suggestionId },
    });

    let result;

    if (!suggestion) {
      throw new InternalError({
        message: "Sugestão não encontrada com o id: " + suggestionId,
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    if (suggestion[field]) {
      result = await database.storeSuggestion.update({
        where: { id: suggestionId },
        data: {
          [field]: {
            votes: suggestion[field].votes + 1,
            value: suggestion[field].value,
          },
        },
      });
    } else {
      throw new InternalError({
        message:
          "Nenhuma sugestão foi encontrada no campo " +
          field +
          " com o id inserido;",
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    return result;
  }

  static async deslike(suggestionId: string, field: StoreFields) {
    const suggestion = await database.storeSuggestion.findUnique({
      where: { id: suggestionId },
    });

    let result;

    if (!suggestion) {
      throw new InternalError({
        message: "Sugestão não encontrada com o id: " + suggestionId,
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    if (suggestion[field]) {
      result = await database.storeSuggestion.update({
        where: { id: suggestionId },
        data: {
          [field]: {
            votes: suggestion[field].votes - 1,
            value: suggestion[field].value,
          },
        },
      });
    } else {
      throw new InternalError({
        message:
          "Nenhuma sugestão foi encontrada no campo " +
          field +
          " com o id inserido;",
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    return result;
  }

  static async isUnique(acronym: string, cnpj: string) {
    const withAcronym = await Store.findOneByAcronym(acronym);
    const withCnpj = await Store.findOneByCpnj(cnpj);

    return !withAcronym && !withCnpj;
  }
}
