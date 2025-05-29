
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X, Bot, Users } from 'lucide-react';

interface NodePropertiesProps {
  selectedNode: any;
  onUpdateNode: (nodeId: string, data: any) => void;
  onClose: () => void;
  chatbots?: any[];
}

const NodeProperties = ({ selectedNode, onUpdateNode, onClose, chatbots = [] }: NodePropertiesProps) => {
  if (!selectedNode) return null;

  const handleUpdate = (field: string, value: string) => {
    const updatedData = {
      ...selectedNode.data,
      [field]: value
    };
    onUpdateNode(selectedNode.id, updatedData);
  };

  const renderMessageNodeFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="message">Mensagem</Label>
        <Textarea
          id="message"
          value={selectedNode.data.message || ''}
          onChange={(e) => handleUpdate('message', e.target.value)}
          placeholder="Digite a mensagem..."
          rows={4}
        />
      </div>
    </>
  );

  const renderActionNodeFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="actionType">Tipo de Ação</Label>
        <Select
          value={selectedNode.data.actionType || ''}
          onValueChange={(value) => handleUpdate('actionType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="webhook">Webhook</SelectItem>
            <SelectItem value="api">API Call</SelectItem>
            <SelectItem value="database">Banco de Dados</SelectItem>
            <SelectItem value="email">Enviar Email</SelectItem>
            <SelectItem value="chatbot">Transferir para Chatbot</SelectItem>
            <SelectItem value="department">Transferir para Departamento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedNode.data.actionType === 'chatbot' && (
        <div className="space-y-2">
          <Label htmlFor="chatbot">Chatbot</Label>
          <Select
            value={selectedNode.data.chatbotId || ''}
            onValueChange={(value) => handleUpdate('chatbotId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um chatbot" />
            </SelectTrigger>
            <SelectContent>
              {chatbots.map((chatbot) => (
                <SelectItem key={chatbot.id} value={chatbot.id}>
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    {chatbot.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedNode.data.actionType === 'department' && (
        <div className="space-y-2">
          <Label htmlFor="department">Departamento</Label>
          <Select
            value={selectedNode.data.department || ''}
            onValueChange={(value) => handleUpdate('department', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vendas">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Vendas
                </div>
              </SelectItem>
              <SelectItem value="suporte">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Suporte Técnico
                </div>
              </SelectItem>
              <SelectItem value="financeiro">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Financeiro
                </div>
              </SelectItem>
              <SelectItem value="atendimento">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Atendimento Geral
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="action">Configuração da Ação</Label>
        <Textarea
          id="action"
          value={selectedNode.data.action || ''}
          onChange={(e) => handleUpdate('action', e.target.value)}
          placeholder="Configure a ação..."
          rows={3}
        />
      </div>
    </>
  );

  const renderConditionNodeFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="conditionType">Tipo de Condição</Label>
        <Select
          value={selectedNode.data.conditionType || ''}
          onValueChange={(value) => handleUpdate('conditionType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Texto contém</SelectItem>
            <SelectItem value="number">Comparação numérica</SelectItem>
            <SelectItem value="regex">Expressão regular</SelectItem>
            <SelectItem value="webhook">Webhook response</SelectItem>
            <SelectItem value="intent">Intenção do usuário</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="condition">Condição</Label>
        <Input
          id="condition"
          value={selectedNode.data.condition || ''}
          onChange={(e) => handleUpdate('condition', e.target.value)}
          placeholder="Digite a condição..."
        />
      </div>
    </>
  );

  const renderEndNodeFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="endType">Tipo de Fim</Label>
        <Select
          value={selectedNode.data.endType || ''}
          onValueChange={(value) => handleUpdate('endType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="success">Sucesso</SelectItem>
            <SelectItem value="transfer">Transferir para humano</SelectItem>
            <SelectItem value="timeout">Timeout</SelectItem>
            <SelectItem value="error">Erro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const renderNodeSpecificFields = () => {
    switch (selectedNode.type) {
      case 'message':
        return renderMessageNodeFields();
      case 'action':
        return renderActionNodeFields();
      case 'condition':
        return renderConditionNodeFields();
      case 'end':
        return renderEndNodeFields();
      default:
        return null;
    }
  };

  return (
    <Card className="w-full p-4 bg-background border shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Propriedades do Nó</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Título</Label>
          <Input
            id="label"
            value={selectedNode.data.label || ''}
            onChange={(e) => handleUpdate('label', e.target.value)}
            placeholder="Digite o título..."
          />
        </div>
        
        {renderNodeSpecificFields()}
      </div>
    </Card>
  );
};

export default NodeProperties;
