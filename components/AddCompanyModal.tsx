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

interface AddCompanyModalProps {
  children: React.ReactNode;
  updateList: () => void;
  updateFilter?: (value: string) => void;
}

export function AddCompanyModal(props: AddCompanyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newCompany, setNewCompany] = useState({
    acronym: "",
    tradeName: "",
    companyName: "",
    cnpj: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    const raw = JSON.stringify(newCompany);

    await fetch("/api/store/suggestion/create", {
      method: "POST",
      headers: headers,
      body: raw,
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.errorId) {
          props.updateList();
          setIsOpen(false);
        }

        setIsLoading(false);
        setIsOpen(false);
        props.updateFilter?.(newCompany.cnpj);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCompany((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Empresa</DialogTitle>
          <DialogDescription>
            Preencha os dados da nova empresa. Todos os campos são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="sigla">
                <span className="text-red-500">*</span> Sigla
              </label>
              <Input
                id="sigla"
                name="acronym"
                value={newCompany.acronym}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div>
              <label htmlFor="nome_fantasia">
                <span className="text-red-500">*</span> Nome Fantasia
              </label>
              <Input
                id="nome_fantasia"
                name="tradeName"
                value={newCompany.tradeName}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div>
              <label htmlFor="companyName">
                <span className="text-red-500">*</span> Razão Social
              </label>
              <Input
                id="razao_social"
                name="companyName"
                value={newCompany.companyName}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div>
              <label htmlFor="cnpj">
                <span className="text-red-500">*</span> CNPJ
              </label>
              <Input
                id="cnpj"
                name="cnpj"
                value={newCompany.cnpj}
                onChange={handleInputChange}
                className="col-span-3"
                required
                pattern="\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2}"
                title="Digite um CNPJ válido"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Adicionar Empresa"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
