
import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { 
  MessageSquare, 
  Play, 
  Save, 
  Download, 
  Upload,
  Plus,
  Settings,
  Zap
} from 'lucide-react';

import StartNode from '@/components/flow/StartNode';
import MessageNode from '@/components/flow/MessageNode';
import ConditionNode from '@/components/flow/ConditionNode';
import ActionNode from '@/components/flow/ActionNode';
import EndNode from '@/components/flow/EndNode';
import NodeToolbar from '@/components/flow/NodeToolbar';

const nodeTypes = {
  start: StartNode,
  message: MessageNode,
  condition: ConditionNode,
  action: ActionNode,
  end: EndNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 250, y: 0 },
    data: { label: 'Início do Atendimento' },
  },
];

const initialEdges: Edge[] = [];

const FlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeType, setSelectedNodeType] = useState<string>('message');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type,
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
      data: { 
        label: getNodeLabel(type),
        message: '',
        conditions: [],
        actions: []
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const getNodeLabel = (type: string) => {
    switch (type) {
      case 'start': return 'Início';
      case 'message': return 'Mensagem';
      case 'condition': return 'Condição';
      case 'action': return 'Ação';
      case 'end': return 'Fim';
      default: return 'Nó';
    }
  };

  const saveFlow = () => {
    const flowData = { nodes, edges };
    console.log('Salvando fluxo:', flowData);
    // Aqui você integraria com o backend para salvar
  };

  const loadFlow = () => {
    console.log('Carregando fluxo...');
    // Aqui você integraria com o backend para carregar
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Construtor de Fluxos</h1>
            <Badge variant="outline">
              <Zap className="h-3 w-3 mr-1" />
              Editor Visual
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadFlow}>
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline" size="sm" onClick={saveFlow}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={saveFlow}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button size="sm">
              <Play className="h-4 w-4 mr-2" />
              Testar Fluxo
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Toolbar Lateral */}
        <div className="w-64 bg-card border-r p-4">
          <NodeToolbar onAddNode={addNode} />
        </div>

        {/* Área do Flow */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1}
              className="opacity-50"
            />
            <Controls className="bg-card border rounded-lg shadow-sm" />
            <MiniMap 
              className="bg-card border rounded-lg shadow-sm"
              nodeColor="#8b5cf6"
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        </div>

        {/* Painel de Propriedades */}
        <div className="w-80 bg-card border-l p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Propriedades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Selecione um nó para editar suas propriedades
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder;
