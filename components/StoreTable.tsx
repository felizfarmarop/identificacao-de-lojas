"use client";

import { useEffect, useState } from "react";
import { ListRestart, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { copyToClipboard, type StoreWithSuggestion } from "./utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FloatingPrintList from "./FloatingPrintList";
import { TooltipProvider } from "@/components/ui/tooltip";
import ShareButton from "./ShareButton";
import CustomTable from "./Table/CustomTable";
import { AddCompanyModal } from "./AddCompanyModal";

export default function EmpresaTable() {
  const [filter, setFilter] = useState("");
  const [printList, setPrintList] = useState<string[]>([]);
  const [isPrintListExpanded, setIsPrintListExpanded] = useState(false);
  const [stores, setStores] = useState<StoreWithSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [state, updateState] = useState(0);

  useEffect(() => {
    setIsLoading(true);

    fetch("/api/store/list")
      .then((res) => res.json())
      .then((data: { stores: StoreWithSuggestion[] }) => {
        setStores(data.stores);
        setIsLoading(false);
      });
  }, [state]);

  const updateList = () => {
    updateState((v) => v + 1);
  };

  const updateFilter = (value: string) => {
    setFilter(value);
  };

  const filteredStores = stores.filter((store) => {
    const searchTerm = filter.toLowerCase();
    const cnpjWithoutPunctuation = store.cnpj.replace(/[^\d]+/g, "");
    return (
      store.acronym.toLowerCase().includes(searchTerm) ||
      store.tradeName.toLowerCase().includes(searchTerm) ||
      store.companyName.toLowerCase().includes(searchTerm) ||
      store.cnpj.includes(searchTerm) ||
      cnpjWithoutPunctuation.includes(searchTerm)
    );
  });

  const addToPrintList = (sigla: string) => {
    setPrintList([...printList, sigla]);
    setIsPrintListExpanded(true);
  };

  return (
    <TooltipProvider>
      <div>
        <div className="flex justify-between items-center mb-4 gap-4">
          <Button variant={"outline"} onClick={updateList}>
            <ListRestart /> Atualizar Lista
          </Button>
          <AddCompanyModal updateFilter={updateFilter} updateList={updateList}>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Sugerir Nova Empresa
            </Button>
          </AddCompanyModal>
          <Input
            type="text"
            placeholder="Filtrar empresas..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full"
          />
          <ShareButton />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sigla</TableHead>
              <TableHead>Nome Fantasia</TableHead>
              <TableHead>Razão Social</TableHead>
              <TableHead>CNPJ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell>
                  <Button variant={"outline"} disabled>
                    <Loader2 className="animate-spin" />
                    Buscando informações atualizadas
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              filteredStores.map((_, index) => (
                <TableRow key={index}>
                  {
                    CustomTable({
                      stores: filteredStores,
                      action: addToPrintList,
                      field: "acronym",
                      updateList,
                    })[index]
                  }
                  {
                    CustomTable({
                      stores: filteredStores,
                      action: copyToClipboard,
                      field: "tradeName",
                      updateList,
                    })[index]
                  }
                  {
                    CustomTable({
                      stores: filteredStores,
                      action: copyToClipboard,
                      field: "companyName",
                      updateList,
                    })[index]
                  }
                  {
                    CustomTable({
                      stores: filteredStores,
                      action: (v) => copyToClipboard(v, true),
                      field: "cnpj",
                      updateList,
                    })[index]
                  }
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <FloatingPrintList
          printList={printList}
          setPrintList={setPrintList}
          isExpanded={isPrintListExpanded}
          setIsExpanded={setIsPrintListExpanded}
        />
      </div>
    </TooltipProvider>
  );
}
