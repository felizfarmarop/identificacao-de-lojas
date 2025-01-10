"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import FloatingPrintList from "./FloatingPrintList";
import { FutureFeaturesModal } from "./FutureFeaturesModal";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import ShareButton from "./ShareButton";
import { Store } from "@prisma/client";

export default function EmpresaTable() {
  const [filter, setFilter] = useState("");
  const [printList, setPrintList] = useState<string[]>([]);
  const [isPrintListExpanded, setIsPrintListExpanded] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    fetch("/api/store/list")
      .then((res) => res.json())
      .then((data: { stores: Store[] }) => {
        setStores(data.stores);
      });
  }, []);

  const filteredEmpresas = stores.filter((store) => {
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

  const copyToClipboard = (text: string, isCNPJ = false) => {
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
            {filteredEmpresas.map((store, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-2 group">
                          <Button
                            variant="link"
                            onClick={() => addToPrintList(store.acronym)}
                          >
                            {store.acronym}
                          </Button>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <FutureFeaturesModal
                              actionType="edit"
                              fieldName="Sigla"
                              companyName={store.tradeName}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </FutureFeaturesModal>
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clique para adicionar à lista de impressão</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-2 group cursor-pointer">
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => copyToClipboard(store.tradeName)}
                          >
                            {store.tradeName}
                          </Button>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <FutureFeaturesModal
                              actionType="edit"
                              fieldName="Nome Fantasia"
                              companyName={store.tradeName}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </FutureFeaturesModal>
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clique para copiar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-2 group cursor-pointer">
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => copyToClipboard(store.companyName)}
                          >
                            {store.companyName}
                          </Button>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <FutureFeaturesModal
                              actionType="edit"
                              fieldName="Razão Social"
                              companyName={store.companyName}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </FutureFeaturesModal>
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clique para copiar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-2 group cursor-pointer">
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => copyToClipboard(store.cnpj, true)}
                          >
                            {store.cnpj}
                          </Button>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <FutureFeaturesModal
                              actionType="edit"
                              fieldName="CNPJ"
                              companyName={store.companyName}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </FutureFeaturesModal>
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clique para copiar (sem pontuação)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
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
