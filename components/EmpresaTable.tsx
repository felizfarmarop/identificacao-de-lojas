'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Plus } from 'lucide-react'
import FloatingPrintList from './FloatingPrintList'
import { FutureFeaturesModal } from './FutureFeaturesModal'
import { Empresa, stores } from '../data/stores'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

export default function EmpresaTable() {
  const [filter, setFilter] = useState('')
  const [printList, setPrintList] = useState<string[]>([])
  const [isPrintListExpanded, setIsPrintListExpanded] = useState(false);
  const [empresas, setEmpresas] = useState<Empresa[]>(stores);

  const filteredEmpresas = empresas.filter(empresa => {
    const searchTerm = filter.toLowerCase();
    const cnpjWithoutPunctuation = empresa.cnpj.replace(/[^\d]+/g, '');
    return (
      empresa.sigla.toLowerCase().includes(searchTerm) ||
      empresa.nome_fantasia.toLowerCase().includes(searchTerm) ||
      empresa.razao_social.toLowerCase().includes(searchTerm) ||
      empresa.cnpj.includes(searchTerm) ||
      cnpjWithoutPunctuation.includes(searchTerm)
    );
  });

  const addToPrintList = (sigla: string) => {
    setPrintList([...printList, sigla])
    setIsPrintListExpanded(true)
  }

  const copyToClipboard = (text: string, isCNPJ = false) => {
    const contentToCopy = isCNPJ ? text.replace(/[^\d]+/g, '') : text;
    navigator.clipboard.writeText(contentToCopy).then(() => {
      alert("Conteúdo copiado para a área de transferência!")
    }).catch((err) => {
      console.error('Erro ao copiar texto: ', err)
      alert("Não foi possível copiar o conteúdo.")
    })
  }

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
          {filteredEmpresas.map((empresa, index) => (
            <TableRow key={index}>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 group">
                        <Button variant="link" onClick={() => addToPrintList(empresa.sigla)}>
                          {empresa.sigla}
                        </Button>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <FutureFeaturesModal actionType="edit" fieldName="Sigla" companyName={empresa.nome_fantasia}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
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
                        <Button variant="link" className="p-0" onClick={() => copyToClipboard(empresa.nome_fantasia)}>
                          {empresa.nome_fantasia}
                        </Button>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <FutureFeaturesModal actionType="edit" fieldName="Nome Fantasia" companyName={empresa.nome_fantasia}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
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
                        <Button variant="link" className="p-0" onClick={() => copyToClipboard(empresa.razao_social)}>
                          {empresa.razao_social}
                        </Button>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <FutureFeaturesModal actionType="edit" fieldName="Razão Social" companyName={empresa.nome_fantasia}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
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
                        <Button variant="link" className="p-0" onClick={() => copyToClipboard(empresa.cnpj, true)}>
                          {empresa.cnpj}
                        </Button>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <FutureFeaturesModal actionType="edit" fieldName="CNPJ" companyName={empresa.nome_fantasia}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
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
  )
}

