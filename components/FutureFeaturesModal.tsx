'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, MessageCircle, Edit } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"

interface FutureFeaturesModalProps {
  children: React.ReactNode
  actionType: 'add' | 'edit'
  fieldName?: string
  companyName?: string
}

export function FutureFeaturesModal({ children, actionType, fieldName, companyName }: FutureFeaturesModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const getInitialWhatsAppMessage = () => {
    let message = "Olá, estou entrando em contato sobre a tabela de empresas do sistema. "
    
    if (actionType === 'add') {
      message += "Gostaria de sugerir a adição de uma nova empresa."
    } else if (actionType === 'edit') {
      message += `Gostaria de sugerir uma edição ${fieldName ? `no campo ${fieldName}` : ''} ${companyName ? `da empresa ${companyName}` : ''}.`
    }

    message += " Poderia me informar sobre quando esta funcionalidade estará disponível?"

    return message
  }

  const [whatsappMessage, setWhatsappMessage] = useState(getInitialWhatsAppMessage())

  const encodedMessage = encodeURIComponent(whatsappMessage)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Funcionalidade Futura</DialogTitle>
          <DialogDescription>
            Esta funcionalidade será adicionada em uma atualização futura.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-2">Em caso de dúvidas, entre em contato pelo WhatsApp:</p>
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <MessageCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div className="flex-grow">
                  {isEditing ? (
                    <Textarea
                      value={whatsappMessage}
                      onChange={(e) => setWhatsappMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{whatsappMessage}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex-shrink-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <a 
            href={`https://wa.me/5511964490534?text=${encodedMessage}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Contatar via WhatsApp
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </a>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

