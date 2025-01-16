import { Store, StoreSuggestion } from "@prisma/client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";
import { Loader2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

export function HoverSuggestionCard(props: {
  value: string;
  field: keyof Omit<Store, "id">;
  suggestions: StoreSuggestion[];
  addToPrintList: (value: string) => void;
  updateList: () => void;
  action: "print" | "copy";
}) {
  const filteredSuggestions = props.suggestions
    .filter((s) => s[props.field])
    .sort((a, b) => b[props.field]!.votes - a[props.field]!.votes);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [isLoadingDeslike, setIsLoadingDeslike] = useState(false);

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const hoverTitle =
    "Clique para " +
    (props.action === "print"
      ? "adicionar à lista de impressão"
      : "copiar o texto");

  const SuggestionsAtField = filteredSuggestions.map((suggestions, index) => {
    const { value, votes } = suggestions[props.field]!;

    const handleLike = () => {
      setIsLoadingLike(true);

      const raw = JSON.stringify({
        field: props.field,
        suggestionId: suggestions.id,
      });

      fetch("/api/store/suggestion/like", {
        method: "POST",
        headers: headers,
        body: raw,
      })
        .then((response) => response.json())
        .then(() => {
          props.updateList();
          setIsLoadingLike(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoadingLike(false);
        });
    };

    const handleDeslike = () => {
      setIsLoadingDeslike(true);

      const raw = JSON.stringify({
        field: props.field,
        suggestionId: suggestions.id,
      });

      fetch("/api/store/suggestion/deslike", {
        method: "POST",
        headers: headers,
        body: raw,
      })
        .then((response) => response.json())
        .then(() => {
          props.updateList();
          setIsLoadingLike(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoadingLike(false);
        });
    };

    return (
      <span key={index} className="flex gap-2 justify-between">
        <Button
          variant="link"
          title={hoverTitle}
          onClick={() => props.addToPrintList(value)}
        >
          {value}
        </Button>
        <span className="flex gap-2 align-baseline justify-center">
          <Button
            title={"Curtir sugestão"}
            size={"icon"}
            variant={"ghost"}
            disabled={isLoadingLike}
            onClick={handleLike}
          >
            {isLoadingLike ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ThumbsUp />
            )}
          </Button>
          <span className="pt-2">{votes}</span>
          <Button
            title={"Descurtir sugestão"}
            disabled={isLoadingDeslike}
            size={"icon"}
            variant={"ghost"}
            onClick={handleDeslike}
          >
            {isLoadingDeslike ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ThumbsDown />
            )}
          </Button>
        </span>
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
