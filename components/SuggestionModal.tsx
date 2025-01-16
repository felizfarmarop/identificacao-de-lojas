"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface SuggestionModalProps {
  storeId: string;
  field: string;
  fieldPlaceholder: string;
  currentValue: string;
  children: React.ReactNode;
  updateList: () => void;
}

export function SuggestionModal(props: SuggestionModalProps) {
  const [suggestion, setSuggestion] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const raw = JSON.stringify({
      field: props.field,
      value: suggestion,
      storeId: props.storeId,
    });

    setIsLoading(true);

    await fetch("/api/store/suggestion/edit", {
      method: "POST",
      headers: headers,
      body: raw,
    })
      .then((response) => response.json())
      .then((result) => {
        setIsLoading(false);

        if (result.errorId) {
          return setErrorMessage(result.message);
        } else {
          props.updateList();
          setIsOpen(false);
          setSuggestion("");
        }
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Sugerir alteração para {props.fieldPlaceholder}
            </DialogTitle>

            <DialogDescription>
              Faça sua sugestão para alterar este campo. A alteração será
              revisada antes de ser aplicada.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="current" className="text-right">
                Atual
              </label>
              <Input
                id="current"
                value={props.currentValue}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="suggestion" className="text-right">
                Sugestão
              </label>
              <Input
                id="suggestion"
                value={suggestion}
                required
                onChange={(e) => setSuggestion(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Enviar sugestão"
              )}
            </Button>
          </DialogFooter>
          {errorMessage && (
            <Alert className="mt-4 ring-red-500 ring-1">
              <AlertTitle className="text-red-500">
                *Um erro encontrado!
              </AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
