
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  GitBranch, 
  Zap, 
  Square, 
  Play,
  Plus
} from 'lucide-react';

interface NodeToolbarProps {
  onAddNode: (type: string) => void;
}

const NodeToolbar = ({ onAddNode }: NodeToolbarProps) => {
  const nodeTypes = [
    {
      type: 'message',
      label: 'Mensagem',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      description: 'Enviar mensagem para o cliente'
    },
    {
      type: 'condition',
      label: 'Condição',
      icon: GitBranch,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100',
      description: 'Criar bifurcação no fluxo'
    },
    {
      type: 'action',
      label: 'Ação',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      description: 'Executar ação específica'
    },
    {
      type: 'end',
      label: 'Fim',
      icon: Square,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      description: 'Finalizar atendimento'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Componentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {nodeTypes.map((node) => {
          const IconComponent = node.icon;
          return (
            <Button
              key={node.type}
              variant="ghost"
              className={`w-full justify-start h-auto p-3 ${node.bgColor}`}
              onClick={() => onAddNode(node.type)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-md bg-white shadow-sm ${node.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">{node.label}</div>
                  <div className="text-xs text-muted-foreground">{node.description}</div>
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default NodeToolbar;
