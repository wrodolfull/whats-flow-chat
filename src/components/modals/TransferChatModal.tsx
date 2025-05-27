
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserX, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TransferChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatId?: string;
}

const TransferChatModal = ({ open, onOpenChange, chatId }: TransferChatModalProps) => {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const { toast } = useToast();

  const availableAgents = [
    {
      id: 1,
      name: 'Maria Santos',
      department: 'Vendas',
      status: 'online',
      activeChats: 3
    },
    {
      id: 2,
      name: 'Pedro Costa',
      department: 'Suporte',
      status: 'online',
      activeChats: 2
    },
    {
      id: 3,
      name: 'Ana Oliveira',
      department: 'Suporte',
      status: 'busy',
      activeChats: 5
    },
    {
      id: 4,
      name: 'Carlos Silva',
      department: 'Financeiro',
      status: 'online',
      activeChats: 1
    }
  ];

  const handleTransfer = () => {
    if (!selectedAgent) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um agente para transferir a conversa.",
        variant: "destructive",
      });
      return;
    }

    const agent = availableAgents.find(a => a.id.toString() === selectedAgent);
    
    toast({
      title: "Conversa transferida!",
      description: `Conversa transferida para ${agent?.name} com sucesso.`,
    });

    onOpenChange(false);
    setSelectedAgent('');
    setTransferNote('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5" />
            Transferir Conversa
          </DialogTitle>
          <DialogDescription>
            Transfira esta conversa para outro agente disponível.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agent">Selecionar Agente</Label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um agente" />
              </SelectTrigger>
              <SelectContent>
                {availableAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id.toString()}>
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                          {agent.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{agent.name}</span>
                          <Badge 
                            variant={agent.status === 'online' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {agent.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{agent.department}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {agent.activeChats} conversas
                          </span>
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note">Nota de Transferência (Opcional)</Label>
            <Textarea
              id="note"
              placeholder="Adicione uma nota sobre o contexto da conversa para o próximo agente..."
              value={transferNote}
              onChange={(e) => setTransferNote(e.target.value)}
              rows={3}
            />
          </div>
          
          {selectedAgent && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> O cliente será notificado sobre a transferência e 
                o histórico da conversa será mantido para o novo agente.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleTransfer} disabled={!selectedAgent}>
            <UserX className="h-4 w-4 mr-2" />
            Transferir Conversa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferChatModal;
