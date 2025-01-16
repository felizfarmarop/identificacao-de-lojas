"use client";

import { useState } from "react";
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

interface AddCompanyModalProps {
  children: React.ReactNode;
}

export function AddCompanyModal(props: AddCompanyModalProps) {
  const [newCompany, setNewCompany] = useState({
    sigla: "",
    nome_fantasia: "",
    razao_social: "",
    cnpj: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    setIsOpen(false);
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
                name="sigla"
                value={newCompany.sigla}
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
                name="nome_fantasia"
                value={newCompany.nome_fantasia}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div>
              <label htmlFor="razao_social">
                <span className="text-red-500">*</span> Razão Social
              </label>
              <Input
                id="razao_social"
                name="razao_social"
                value={newCompany.razao_social}
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
            <Button type="submit">Adicionar Empresa</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
