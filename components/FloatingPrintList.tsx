'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronUp, ChevronDown, Printer, X } from 'lucide-react'

interface FloatingPrintListProps {
  printList: string[]
  setPrintList: React.Dispatch<React.SetStateAction<string[]>>
  isExpanded: boolean
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FloatingPrintList({ printList, setPrintList, isExpanded, setIsExpanded }: FloatingPrintListProps) {
  const [fontSize, setFontSize] = useState('100')
  const [fontColor, setFontColor] = useState('#000000')

  useEffect(() => {
    localStorage?.setItem('fontSize', fontSize)
    localStorage?.setItem('fontColor', fontColor)
  }, [fontSize, fontColor])

  const removeSigla = (index: number) => {
    setPrintList(printList.filter((_, i) => i !== index))
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Lista de Impressão</title>
            <style>
              body { 
                font-family: Arial, sans-serif;
                padding: 20px;
                box-sizing: border-box;
              }
              .sigla-container {
                display: flex;
                flex-wrap: wrap;
                align-items: flex-start;
                justify-content: flex-start;
              }
              .sigla {
                font-size: ${fontSize}px;
                color: ${fontColor};
                font-weight: bold;
                margin-right: 50px;
                margin-bottom: 50px;
              }
            </style>
          </head>
          <body>
            <div class="sigla-container">
              ${printList.map(sigla => `<div class="sigla">${sigla}</div>`).join('')}
            </div>
            <script>
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  return (
    <Card className="fixed bottom-4 right-4 w-64 shadow-lg">
      <CardHeader className="p-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="text-sm flex justify-between items-center">
          Lista de Impressão ({printList.length})
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-2">
          <div className="flex space-x-2 mb-2">
            <Input
              type="number"
              placeholder="Fonte"
              value={fontSize}
              onChange={(e) => {
                const newSize = e.target.value
                setFontSize(newSize)
                localStorage?.setItem('fontSize', newSize)
              }}
              className="w-20"
            />
            <Input
              type="color"
              value={fontColor}
              onChange={(e) => {
                const newColor = e.target.value
                setFontColor(newColor)
                localStorage?.setItem('fontColor', newColor)
              }}
              className="w-20 p-0"
            />
            <Button onClick={handlePrint} size="sm">Imprimir</Button>
          </div>
          <div className="max-h-40 overflow-y-auto">
            {printList.map((sigla, index) => (
              <div key={index} className="flex justify-between items-center mb-1 bg-gray-100 p-1 rounded">
                <div className="flex items-center">
                  <Printer size={16} className="mr-2" />
                  <span>{sigla}</span>
                </div>
                <Button variant="ghost" onClick={() => removeSigla(index)} className="p-0 h-6 w-6" size="sm">
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

