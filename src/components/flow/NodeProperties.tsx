
import React from 'react';
import { Node } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  GitBranch, 
  Zap, 
  Square, 
  Play 
} from 'lucide-react';

interface NodePropertiesProps {
  node: Node;
  onUpdateNode: (nodeId: string, data: any) => void;
}

const NodeProperties = ({ node, onUpdateNode }: NodePropertiesProps) => {
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'start': return Play;
      case 'message': return MessageSquare;
      case 'condition': return GitBranch;
      case 'action': return Zap;
      case 'end': return Square;
      default: return MessageSquare;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'start': return 'text-green-600';
      case 'message': return 'text-blue-600';
      case 'condition': return 'text-yellow-600';
      case 'action': return 'text-purple-600';
      case 'end': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const IconComponent = getNodeIcon(node.type!);

  const updateNodeProperty = (property: string, value: any) => {
    onUpdateNode(node.id, { [property]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <IconComponent className={`h-5 w-5 ${getNodeColor(node.type!)}`} />
          Propriedades do Nó
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Tipo</Label>
          <p className="text-sm text-muted-foreground capitalize">{node.type}</p>
        </div>

        <div>
          <Label htmlFor="node-label">Rótulo</Label>
          <Input
            id="node-label"
            value={node.data.label || ''}
            onChange={(e) => updateNodeProperty('label', e.target.value)}
            placeholder="Digite o rótulo do nó"
          />
        </div>

        {node.type === 'message' && (
          <div>
            <Label htmlFor="node-message">Mensagem</Label>
            <Textarea
              id="node-message"
              value={node.data.message || ''}
              onChange={(e) => updateNodeProperty('message', e.target.value)}
              placeholder="Digite a mensagem a ser enviada"
              rows={4}
            />
          </div>
        )}

        {node.type === 'condition' && (
          <>
            <div>
              <Label htmlFor="node-condition">Condição</Label>
              <Textarea
                id="node-condition"
                value={node.data.condition || ''}
                onChange={(e) => updateNodeProperty('condition', e.target.value)}
                placeholder="Digite a condição a ser avaliada"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="condition-type">Tipo de Condição</Label>
              <Select 
                value={node.data.conditionType || 'text'} 
                onValueChange={(value) => updateNodeProperty('conditionType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto contém</SelectItem>
                  <SelectItem value="equals">Texto igual</SelectItem>
                  <SelectItem value="number">Comparação numérica</SelectItem>
                  <SelectItem value="time">Horário</SelectItem>
                  <SelectItem value="custom">Personalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {node.type === 'action' && (
          <>
            <div>
              <Label htmlFor="node-action">Ação</Label>
              <Textarea
                id="node-action"
                value={node.data.action || ''}
                onChange={(e) => updateNodeProperty('action', e.target.value)}
                placeholder="Descreva a ação a ser executada"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="action-type">Tipo de Ação</Label>
              <Select 
                value={node.data.actionType || 'message'} 
                onValueChange={(value) => updateNodeProperty('actionType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="message">Enviar mensagem</SelectItem>
                  <SelectItem value="transfer">Transferir para agente</SelectItem>
                  <SelectItem value="webhook">Chamar webhook</SelectItem>
                  <SelectItem value="variable">Definir variável</SelectItem>
                  <SelectItem value="wait">Aguardar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {node.type === 'end' && (
          <div>
            <Label htmlFor="end-type">Tipo de Finalização</Label>
            <Select 
              value={node.data.endType || 'normal'} 
              onValueChange={(value) => updateNodeProperty('endType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Finalização normal</SelectItem>
                <SelectItem value="transfer">Transferir para agente</SelectItem>
                <SelectItem value="survey">Pesquisa de satisfação</SelectItem>
                <SelectItem value="restart">Reiniciar fluxo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>ID: {node.id}</p>
            <p>Posição: x:{Math.round(node.position.x)}, y:{Math.round(node.position.y)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NodeProperties;
