
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SendTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatId?: string;
}

const SendTemplateModal = ({ open, onOpenChange, chatId }: SendTemplateModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [parameters, setParameters] = useState<string[]>(['']);
  const { toast } = useToast();

  const templates = [
    {
      id: 'welcome',
      name: 'Boas-vindas',
      content: 'Olá {{1}}, bem-vindo à nossa empresa! Como podemos te ajudar hoje?',
      parameters: ['nome'],
      status: 'approved'
    },
    {
      id: 'order_confirmation',
      name: 'Confirmação de Pedido',
      content: 'Seu pedido {{1}} foi confirmado e será entregue em {{2}}.',
      parameters: ['número do pedido', 'prazo de entrega'],
      status: 'approved'
    },
    {
      id: 'support_followup',
      name: 'Follow-up Suporte',
      content: 'Olá {{1}}, sua solicitação {{2}} foi resolvida. Tudo certo?',
      parameters: ['nome', 'número da solicitação'],
      status: 'approved'
    }
  ];

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setParameters(new Array(template.parameters.length).fill(''));
    }
  };

  const handleParameterChange = (index: number, value: string) => {
    const newParameters = [...parameters];
    newParameters[index] = value;
    setParameters(newParameters);
  };

  const handleSend = () => {
    if (!selectedTemplate) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um template.",
        variant: "destructive",
      });
      return;
    }

    if (selectedTemplateData && parameters.some(p => !p.trim())) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os parâmetros do template.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Template enviado!",
      description: "Mensagem template foi enviada com sucesso.",
    });

    onOpenChange(false);
    setSelectedTemplate('');
    setParameters(['']);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Enviar Template
          </DialogTitle>
          <DialogDescription>
            Selecione e configure um template aprovado para envio.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{template.name}</span>
                      <Badge variant="default" className="ml-2">
                        {template.status === 'approved' ? 'Aprovado' : 'Pendente'}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedTemplateData && (
            <>
              <div className="space-y-2">
                <Label>Preview do Template</Label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-700">{selectedTemplateData.content}</p>
                </div>
              </div>
              
              {selectedTemplateData.parameters.length > 0 && (
                <div className="space-y-3">
                  <Label>Parâmetros</Label>
                  {selectedTemplateData.parameters.map((param, index) => (
                    <div key={index} className="space-y-1">
                      <Label className="text-sm text-gray-600">{param}</Label>
                      <Input
                        placeholder={`Digite ${param}`}
                        value={parameters[index] || ''}
                        onChange={(e) => handleParameterChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Preview Final</Label>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm">
                    {selectedTemplateData.content.replace(/\{\{(\d+)\}\}/g, (match, num) => {
                      const index = parseInt(num) - 1;
                      return parameters[index] || `{{${num}}}`;
                    })}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={!selectedTemplate}>
            <Send className="h-4 w-4 mr-2" />
            Enviar Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendTemplateModal;
