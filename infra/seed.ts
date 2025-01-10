import { StoreSuggestion } from "@/models/storeSuggestion.model";

async function createSuggestions() {
  await StoreSuggestion.create({
    acronym: "teste",
    cnpj: "123456789101213",
    companyName: "teste de razão social",
    tradeName: "teste de nome fantasia",
  });
}

createSuggestions();
