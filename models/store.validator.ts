import { z } from "zod";

import { ObjectId } from "bson";

const storeFields = ["acronym", "cnpj", "companyName", "tradeName"] as const;

export const fieldsSchema = z.enum(storeFields, {
  required_error:
    "Ao menos um dos seguintes campos devem ser identificados em FIELD: " +
    storeFields.join(", ") +
    ".",
  invalid_type_error: "O campo deve ser do tipo string.",
});

export const idSchema = z
  .string({ required_error: "ID é um campo obrigatório" })
  .refine((id) => ObjectId.isValid(id), "ID deve ser um ObjectID Válido");

export const storeIdSchema = z
  .string({ required_error: "STORE_ID é um campo obrigatório" })
  .refine((id) => ObjectId.isValid(id), "STORE_ID deve ser um ObjectID Válido");

export const suggestionIdSchema = z
  .string({ required_error: "SUGGESTION_ID é um campo obrigatório" })
  .refine(
    (id) => ObjectId.isValid(id),
    "SUGGESTION_ID deve ser um ObjectID Válido"
  );

export const acronymSchema = z
  .string({ required_error: "ACRONYM é um campo obrigatório" })
  .min(1, "ACRONYM não pode ser um campo vazio.")
  .transform((a) => a.toUpperCase());

export const cnpjSchema = z
  .string({ required_error: "CNPJ é um campo obrigatório." })
  .min(14, "CNPJ deve conter ao menos 14 caracteres")
  .max(18, "CNPJ não pode exceder 18 caracteres")
  .transform((doc) => doc.replace(/\D/g, ""))
  .refine((cnpj) => /^\d{14}$/.test(cnpj), "CNPJ deve ser válido em números.")
  .transform((cnpj) =>
    cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  );

export const companyNameSchema = z
  .string({ required_error: "COMPANY_NAME é um campo obrigatório." })
  .min(1, "COMPANY_NAME não pode ser um campo vazio.")
  .transform((a) => a.toUpperCase());

export const tradeNameSchema = z
  .string({ required_error: "TRADE_NAME é um campo obrigatório." })
  .min(1, "TRADE_NAME não pode ser um campo vazio.")
  .transform((a) => a.toUpperCase());

export const votesSchema = z.number({
  required_error: "VOTES é um campo obrigatório.",
  invalid_type_error: "VOTES deve ser um número válido.",
});

export const suggestionFieldAcronymSchema = z.object({
  votes: votesSchema,
  value: acronymSchema,
});
export const suggestionFieldTradeNameSchema = z.object({
  votes: votesSchema,
  value: tradeNameSchema,
});
export const suggestionFieldCompanyNameSchema = z.object({
  votes: votesSchema,
  value: companyNameSchema,
});
export const suggestionFieldCnpjSchema = z.object({
  votes: votesSchema,
  value: cnpjSchema,
});

export const StoreSuggestionSchema = z.object({
  storeId: idSchema,
  acronym: suggestionFieldAcronymSchema,
  cnpj: suggestionFieldCnpjSchema,
  companyName: suggestionFieldCompanyNameSchema,
  tradeName: suggestionFieldTradeNameSchema,
  votes: votesSchema,
});

export const StoreSchema = z.object({
  id: idSchema,
  acronym: acronymSchema,
  cnpj: cnpjSchema,
  companyName: companyNameSchema,
  tradeName: tradeNameSchema,
  suggestions: z.array(StoreSuggestionSchema),
});

export const StoreWithoutIdSchema = z.object({
  acronym: acronymSchema,
  cnpj: cnpjSchema,
  companyName: companyNameSchema,
  tradeName: tradeNameSchema,
});
