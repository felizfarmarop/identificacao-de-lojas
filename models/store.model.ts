import database from "@/infra/database";
import { Prisma } from "@prisma/client";
import { StoreWithoutIdSchema } from "./store.validator";
import { ZodError } from "zod";
import { InternalError } from "@/infra/error";
import { HttpStatusCode } from "@/infra/httpStatusCode";

type StoreWithSuggestions = Prisma.StoreGetPayload<{
  include: {
    suggestions: true;
  };
}>;
export type StoreFields = "acronym" | "cnpj" | "companyName" | "tradeName";

export class Store {
  id: StoreWithSuggestions["id"];
  acronym: StoreWithSuggestions["acronym"];
  tradeName: StoreWithSuggestions["tradeName"];
  companyName: StoreWithSuggestions["companyName"];
  cnpj: StoreWithSuggestions["cnpj"];
  suggestions?: StoreWithSuggestions["suggestions"];
  verified?: boolean = true;

  constructor(props: StoreWithSuggestions) {
    this.id = props.id;
    this.acronym = props.acronym;
    this.tradeName = props.tradeName;
    this.companyName = props.companyName;
    this.cnpj = props.cnpj;
    this.suggestions = props.suggestions;
    this.verified = props.verified;
  }

  static async create(props: Partial<StoreWithSuggestions>) {
    delete props.suggestions;
    delete props.id;

    let result = props;

    try {
      result = StoreWithoutIdSchema.parse(props);
    } catch (err) {
      if (err instanceof ZodError) {
        throw err;
      }
    }

    if (!(await Store.isUnique(result.acronym!, result.cnpj!))) {
      throw new InternalError({
        message: "Essa loja não é a unica com esses dados informados",
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
    }

    return await database.store.create({
      data: {
        acronym: result.acronym!,
        cnpj: result.cnpj!,
        companyName: result.companyName!,
        tradeName: result.tradeName!,
        verified: false,
      },
    });
  }

  static async isUnique(acronym: string, cnpj: string) {
    const withAcronym = await Store.findOneByAcronym(acronym);
    const withCnpj = await Store.findOneByCpnj(cnpj);

    if (withAcronym) {
      throw new InternalError({
        message: "Já existe uma empresa cadastrada com a sigla " + acronym,
        statusCode: HttpStatusCode.FORBIDDEN,
      });
    }

    if (withCnpj) {
      throw new InternalError({
        message: "Já existe uma empresa cadastrada com o cnpj " + cnpj,
        statusCode: HttpStatusCode.FORBIDDEN,
      });
    }

    return !withAcronym && !withCnpj;
  }

  static async findOneByAcronym(acronym: string) {
    const result = await database.store.findFirst({
      where: { acronym: acronym },
      include: { suggestions: true },
    });

    if (result) return new Store(result);
    else return undefined;
  }

  static async findOneByCpnj(cnpj: string) {
    const result = await database.store.findFirst({
      where: { cnpj: cnpj },
      include: { suggestions: true },
    });

    if (result) return new Store(result);
    else return undefined;
  }
  static async findMany() {
    const result = await database.store.findMany({
      include: { suggestions: true },
    });

    if (result.length) return result.map((store) => new Store(store));
    else return [];
  }
}
