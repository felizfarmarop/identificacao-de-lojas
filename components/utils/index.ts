import { Prisma } from "@prisma/client";

export const copyToClipboard = (text: string, isCNPJ = false) => {
  const contentToCopy = isCNPJ ? text.replace(/[^\d]+/g, "") : text;
  navigator.clipboard
    .writeText(contentToCopy)
    .then(() => {
      alert("Conteúdo copiado para a área de transferência!");
    })
    .catch((err) => {
      console.error("Erro ao copiar texto: ", err);
      alert("Não foi possível copiar o conteúdo.");
    });
};

export type StoreWithSuggestion = Prisma.StoreGetPayload<{
  include: { suggestions: true };
}>;
