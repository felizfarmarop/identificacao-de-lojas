import database from "@/infra/database";
import { type Store as TStore } from "@prisma/client";
import { StoreSchema } from "./store.validator";
import { ZodError } from "zod";

type CreateStoreSuggestionProps = Partial<TStore> & {
  storeId: string;
};

export class StoreSuggestion {
  acronym: TStore["acronym"];
  tradeName: TStore["tradeName"];
  companyName: TStore["companyName"];
  cnpj: TStore["cnpj"];

  constructor(props: TStore) {
    this.acronym = props.acronym;
    this.tradeName = props.tradeName;
    this.companyName = props.companyName;
    this.cnpj = props.cnpj;
  }

  static async create({ storeId, ...props }: CreateStoreSuggestionProps) {
    let result = props;

    try {
      result = StoreSchema.parse(props);
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
}
