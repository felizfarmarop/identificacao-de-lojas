import database from "@/infra/database";
import { type Store as TStore } from "@prisma/client";
import { StoreSchema } from "./store.validator";
import { ZodError } from "zod";
import { InternalError } from "@/infra/error";
import { HttpStatusCode } from "@/infra/httpStatusCode";

export class Store {
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

  static async create(props: TStore) {
    let result = props;

    try {
      result = StoreSchema.parse(props);
    } catch (err) {
      if (err instanceof ZodError) {
        throw err;
      }
    }

    if (await Store.isUnique(result.acronym, result.cnpj)) {
      throw new InternalError({
        message: "This store is not unique",
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
    }

    await database.store.create({
      data: {
        acronym: result.acronym,
        cnpj: result.cnpj,
        companyName: result.companyName,
        tradeName: result.tradeName,
      },
    });
  }

  static async isUnique(acronym: string, cnpj: string) {
    const withAcronym = await Store.findOneByAcronym(acronym);
    const withCnpj = await Store.findOneByCpnj(cnpj);

    return !withAcronym && !withCnpj;
  }

  static async findOneByAcronym(acronym: string) {
    const result = await database.store.findFirst({
      where: { acronym: acronym },
    });

    if (result) return new Store(result);
    else return undefined;
  }

  static async findOneByCpnj(cnpj: string) {
    const result = await database.store.findFirst({
      where: { cnpj: cnpj },
    });

    if (result) return new Store(result);
    else return undefined;
  }
  static async findMany() {
    const result = await database.store.findMany();

    if (result.length) return result.map((store) => new Store(store));
    else return [];
  }
}
