
import { Button } from '@/components/ui/button'
import { Share } from 'lucide-react';

export default function ShareButton() {

    const shareData = { 
        title: "Tabela de Lojas Feliz Farma",
        text: "Tabela de Lpjas da Feliz Farma",
        url: "https://lojas-felizfarma.vercel.app"
    }

    async function handleShare() {
        try {
            await navigator.share(shareData);
       } catch (err) { 
            alert('Falha ao tentar compartilhar.');
            console.log(err)
       }
    }

    return <Button onClick={() => handleShare()} variant={'outline'}> 
        Compartilhar Página <Share />
    </Button>
}