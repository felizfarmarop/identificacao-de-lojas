import { Store, StoreSuggestion } from "@prisma/client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";

export function HoverSuggestionCard(props: {
  value: string;
  field: keyof Omit<Store, "id">;
  suggestions: StoreSuggestion[];
  addToPrintList: (value: string) => void;
  action: "print" | "copy";
}) {
  const filteredSuggestions = props.suggestions.filter((s) => s[props.field]);

  const hoverTitle =
    "Clique para " +
    (props.action === "print"
      ? "adicionar à lista de impressão"
      : "copiar o texto");

  const SuggestionsAtField = filteredSuggestions
    .sort((a, b) => b[props.field]!.votes - a[props.field]!.votes)
    .map((suggestions, index) => {
      const { value, votes } = suggestions[props.field]!;

      return (
        <span key={index}>
          <Button
            variant="link"
            title={hoverTitle}
            onClick={() => props.addToPrintList(value)}
          >
            {value}
          </Button>
          <span title="Funcionalidade não implementada">{votes}</span>
        </span>
      );
    });

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="link"
          onClick={() => props.addToPrintList(props.value)}
          title={hoverTitle}
        >
          {props.value}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="flex flex-col w-auto">
        {SuggestionsAtField.length ? (
          SuggestionsAtField
        ) : (
          <Button variant={"link"} disabled>
            Nenhuma sugestão encontrada
          </Button>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
