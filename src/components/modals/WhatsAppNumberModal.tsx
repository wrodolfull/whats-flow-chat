
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Phone, Settings } from 'lucide-react';

interface WhatsAppNumber {
  id: string;
  phoneNumber: string;
  displayName: string;
  phoneNumberId: string;
  accessToken: string;
  businessAccountId: string;
  status: 'active' | 'inactive' | 'pending';
  assignedAgent?: string;
  webhookUrl: string;
  verifyToken: string;
}

interface WhatsAppNumberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNumberCreated: (number: Omit<WhatsAppNumber, 'id'>) => void;
  onNumberUpdated: (number: Omit<WhatsAppNumber, 'id'>) => void;
  editingNumber?: WhatsAppNumber | null;
}

const WhatsAppNumberModal = ({ 
  open, 
  onOpenChange, 
  onNumberCreated, 
  onNumberUpdated, 
  editingNumber 
}: WhatsAppNumberModalProps) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    displayName: '',
    phoneNumberId: '',
    accessToken: '',
    businessAccountId: '',
    status: 'active' as const,
    assignedAgent: '',
    webhookUrl: '',
    verifyToken: ''
  });
  const { toast } = useToast();

  const agents = [
    'João Silva',
    'Maria Santos', 
    'Pedro Costa',
    'Ana Oliveira'
  ];

  useEffect(() => {
    if (editingNumber) {
      setFormData({
        phoneNumber: editingNumber.phoneNumber,
        displayName: editingNumber.displayName,
        phoneNumberId: editingNumber.phoneNumberId,
        accessToken: editingNumber.accessToken,
        businessAccountId: editingNumber.businessAccountId,
        status: editingNumber.status,
        assignedAgent: editingNumber.assignedAgent || '',
        webhookUrl: editingNumber.webhookUrl,
        verifyToken: editingNumber.verifyToken
      });
    } else {
      setFormData({
        phoneNumber: '',
        displayName: '',
        phoneNumberId: '',
        accessToken: '',
        businessAccountId: '',
        status: 'active',
        assignedAgent: '',
        webhookUrl: '',
        verifyToken: ''
      });
    }
  }, [editingNumber, open]);

  const generateWebhookUrl = () => {
    const randomId = Math.random().toString(36).substring(2, 8);
    const url = `https://api.empresa.com/webhook/whatsapp/${randomId}`;
    setFormData(prev => ({ ...prev, webhookUrl: url }));
  };

  const generateVerifyToken = () => {
    const token = Math.random().toString(36).substring(2, 15);
    setFormData(prev => ({ ...prev, verifyToken: token }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phoneNumber || !formData.displayName || !formData.phoneNumberId || !formData.accessToken) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (editingNumber) {
      onNumberUpdated(formData);
    } else {
      onNumberCreated(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            {editingNumber ? 'Editar Número WhatsApp' : 'Adicionar Número WhatsApp'}
          </DialogTitle>
          <DialogDescription>
            Configure um novo número WhatsApp Business para envio e recebimento de mensagens.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone-number">Número de Telefone *</Label>
              <Input
                id="phone-number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="+55 11 99999-9999"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="display-name">Nome de Exibição *</Label>
              <Input
                id="display-name"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Ex: Suporte, Vendas"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone-number-id">Phone Number ID *</Label>
              <Input
                id="phone-number-id"
                value={formData.phoneNumberId}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                placeholder="123456789012345"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-account-id">Business Account ID</Label>
              <Input
                id="business-account-id"
                value={formData.businessAccountId}
                onChange={(e) => setFormData(prev => ({ ...prev, businessAccountId: e.target.value }))}
                placeholder="987654321098765"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="access-token">Access Token *</Label>
            <Input
              id="access-token"
              type="password"
              value={formData.accessToken}
              onChange={(e) => setFormData(prev => ({ ...prev, accessToken: e.target.value }))}
              placeholder="EAAxxxxxxxxxxxxxxx"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assigned-agent">Agente Responsável</Label>
            <Select
              value={formData.assignedAgent}
              onValueChange={(value) => setFormData(prev => ({ ...prev, assignedAgent: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um agente" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Button type="button" variant="outline" size="sm" onClick={generateWebhookUrl}>
                Gerar URL
              </Button>
            </div>
            <Input
              id="webhook-url"
              value={formData.webhookUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
              placeholder="https://api.empresa.com/webhook/whatsapp"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="verify-token">Verify Token</Label>
              <Button type="button" variant="outline" size="sm" onClick={generateVerifyToken}>
                Gerar Token
              </Button>
            </div>
            <Input
              id="verify-token"
              value={formData.verifyToken}
              onChange={(e) => setFormData(prev => ({ ...prev, verifyToken: e.target.value }))}
              placeholder="seu-token-de-verificacao"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'active' | 'inactive' | 'pending') => 
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingNumber ? 'Atualizar' : 'Adicionar'} Número
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppNumberModal;
