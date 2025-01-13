import { z } from "zod";

import { ObjectId } from "bson";

export const idSchema = z
  .string()
  .refine((id) => ObjectId.isValid(id), "ID deve ser um ObjectID Válido");


export const acronymSchema = z
  .string({ required_error: "ACRONYM é um campo obrigatório" })
  .min(1, "ACRONYM não pode ser um campo vazio.")
  .transform((a) => a.toUpperCase());

export const cnpjSchema = z
  .string({ required_error: "CNPJ é um campo obrigatório." })
  .min(14, "CNPJ deve conter ao menos 14 caracteres")
  .max(18, "CNPJ não pode exceder 18 caracteres")
  .transform((doc) => doc.replace(/\D/g, ""))
  .refine(
    (cnpj) => /^\d{14}$/.test(cnpj),
    "CNPJ deve conter exatamente 14 caracteres."
  )
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

export const StoreSchema = z.object({

  id: idSchema,

  acronym: acronymSchema,
  cnpj: cnpjSchema,
  companyName: companyNameSchema,
  tradeName: tradeNameSchema,
});
