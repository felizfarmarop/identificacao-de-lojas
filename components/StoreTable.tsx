"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
import { FutureFeaturesModal } from "./FutureFeaturesModal";
import { TooltipProvider } from "@/components/ui/tooltip";
import ShareButton from "./ShareButton";
import CustomTable from "./Table/CustomTable";

export default function EmpresaTable() {
  const [filter, setFilter] = useState("");
  const [printList, setPrintList] = useState<string[]>([]);
  const [isPrintListExpanded, setIsPrintListExpanded] = useState(false);
  const [stores, setStores] = useState<StoreWithSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/store/list")
      .then((res) => res.json())
      .then((data: { stores: StoreWithSuggestion[] }) => {
        setStores(data.stores);
        setIsLoading(false);
      });
  }, []);

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
        <div className="flex justify-between items-center mb-4">
          <FutureFeaturesModal actionType="add">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Sugerir Nova Empresa
            </Button>
          </FutureFeaturesModal>
          <Input
            type="text"
            placeholder="Filtrar empresas..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="ml-4 mr-4 w-full"
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
              filteredStores.map((store, index) => (
                <TableRow key={index}>
                  {
                    CustomTable({
                      stores: stores,
                      action: addToPrintList,
                      field: "acronym",
                    })[index]
                  }
                  {
                    CustomTable({
                      stores: stores,
                      action: copyToClipboard,
                      field: "tradeName",
                    })[index]
                  }
                  {
                    CustomTable({
                      stores: stores,
                      action: copyToClipboard,
                      field: "companyName",
                    })[index]
                  }
                  {
                    CustomTable({
                      stores: stores,
                      action: (v) => copyToClipboard(v, true),
                      field: "cnpj",
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
