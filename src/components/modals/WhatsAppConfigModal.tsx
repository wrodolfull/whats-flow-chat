
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Settings, TestTube, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WhatsAppConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WhatsAppConfigModal = ({ open, onOpenChange }: WhatsAppConfigModalProps) => {
  const [formData, setFormData] = useState({
    phoneNumberId: '',
    accessToken: '',
    webhookUrl: '',
    verifyToken: '',
    businessAccountId: ''
  });
  const [isConnected, setIsConnected] = useState(false);
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  const handleTestConnection = async () => {
    setTesting(true);
    
    // Simular teste de conexão
    setTimeout(() => {
      setTesting(false);
      setIsConnected(true);
      toast({
        title: "Conexão bem-sucedida!",
        description: "WhatsApp Business API conectada com sucesso.",
      });
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phoneNumberId || !formData.accessToken) {
      toast({
        title: "Erro",
        description: "Phone Number ID e Access Token são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Configurações salvas!",
      description: "Configurações do WhatsApp Business API foram salvas com sucesso.",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações WhatsApp Business API
          </DialogTitle>
          <DialogDescription>
            Configure a integração com a API do WhatsApp Business para envio e recebimento de mensagens.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone-id">Phone Number ID *</Label>
              <Input
                id="phone-id"
                value={formData.phoneNumberId}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                placeholder="123456789012345"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-id">Business Account ID</Label>
              <Input
                id="business-id"
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
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              value={formData.webhookUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
              placeholder="https://seu-dominio.com/webhook"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="verify-token">Verify Token</Label>
            <Input
              id="verify-token"
              value={formData.verifyToken}
              onChange={(e) => setFormData(prev => ({ ...prev, verifyToken: e.target.value }))}
              placeholder="seu-token-de-verificacao"
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status da Conexão:</span>
              {isConnected ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Conectado
                </Badge>
              ) : (
                <Badge variant="secondary">Não conectado</Badge>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={testing || !formData.phoneNumberId || !formData.accessToken}
            >
              {testing ? (
                <>Testando...</>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Testar Conexão
                </>
              )}
            </Button>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Configurações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppConfigModal;
