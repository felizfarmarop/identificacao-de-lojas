'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PrintListProps {
  printList: string[]
  setPrintList: React.Dispatch<React.SetStateAction<string[]>>
  handlePrint: () => void
}

export default function PrintList({ printList, setPrintList, handlePrint }: PrintListProps) {
  const [fontSize, setFontSize] = useState('16')
  const [fontColor, setFontColor] = useState('#000000')

  const removeSigla = (sigla: string) => {
    setPrintList(printList.filter(item => item !== sigla))
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Lista de Impressão</h2>
      <div className="flex space-x-2 mb-2">
        <Input
          type="number"
          placeholder="Tamanho da fonte"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="w-40"
        />
        <Input
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
          className="w-20"
        />
        <Button onClick={handlePrint}>Imprimir</Button>
      </div>
      <ul className="list-disc pl-5">
        {printList.map((sigla, index) => (
          <li key={index} style={{ fontSize: `${fontSize}px`, color: fontColor }}>
            {sigla}
            <Button variant="link" onClick={() => removeSigla(sigla)} className="ml-2">
              Remover
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

