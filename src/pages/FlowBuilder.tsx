import React, { useCallback, useState, useEffect } from 'react';
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
  OnSelectionChangeParams,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Play, 
  Save, 
  Download, 
  Upload,
  Plus,
  Settings,
  Zap,
  Trash2,
  FileText,
  Bot
} from 'lucide-react';

import StartNode from '@/components/flow/StartNode';
import MessageNode from '@/components/flow/MessageNode';
import ConditionNode from '@/components/flow/ConditionNode';
import ActionNode from '@/components/flow/ActionNode';
import EndNode from '@/components/flow/EndNode';
import NodeToolbar from '@/components/flow/NodeToolbar';
import NodeProperties from '@/components/flow/NodeProperties';
import { flowsAPI } from '@/api/flows';

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
    position: { x: 250, y: 100 },
    data: { label: 'Início do Atendimento' },
  },
];

const initialEdges: Edge[] = [];

const FlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [flowName, setFlowName] = useState('Novo Fluxo');
  const [flowDescription, setFlowDescription] = useState('');
  const [selectedChatbot, setSelectedChatbot] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flows, setFlows] = useState<any[]>([]);
  const [chatbots, setChatbots] = useState<any[]>([]);
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    if (params.nodes.length === 1) {
      setSelectedNode(params.nodes[0]);
    } else {
      setSelectedNode(null);
    }
  }, []);

  // Load saved flows and chatbots from localStorage on mount
  useEffect(() => {
    loadSavedFlows();
    loadChatbots();
  }, []);

  const loadSavedFlows = () => {
    const savedFlows = localStorage.getItem('flows');
    if (savedFlows) {
      setFlows(JSON.parse(savedFlows));
    }
  };

  const loadChatbots = () => {
    const savedChatbots = localStorage.getItem('chatbots');
    if (savedChatbots) {
      setChatbots(JSON.parse(savedChatbots));
    }
  };

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type,
      position: { 
        x: Math.random() * 300 + 100, 
        y: Math.random() * 300 + 200 
      },
      data: { 
        label: getNodeLabel(type),
        message: type === 'message' ? 'Digite sua mensagem aqui...' : '',
        condition: type === 'condition' ? 'Digite a condição aqui...' : '',
        action: type === 'action' ? 'Digite a ação aqui...' : '',
        chatbotId: type === 'action' ? '' : undefined,
        department: type === 'action' ? '' : undefined,
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

  const updateNodeData = (nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    );
  };

  const deleteSelectedNode = () => {
    if (selectedNode && selectedNode.type !== 'start') {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) => 
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      setSelectedNode(null);
      toast({
        title: "Nó removido",
        description: "O nó foi removido do fluxo.",
      });
    }
  };

  const saveFlowLocally = () => {
    const flowData = {
      id: Date.now().toString(),
      name: flowName,
      description: flowDescription,
      chatbotId: selectedChatbot,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedFlows = localStorage.getItem('flows');
    const flowsList = savedFlows ? JSON.parse(savedFlows) : [];
    flowsList.push(flowData);
    localStorage.setItem('flows', JSON.stringify(flowsList));
    
    setFlows(flowsList);
    
    toast({
      title: "Fluxo salvo localmente!",
      description: "O fluxo foi salvo no armazenamento local.",
    });
  };

  const loadFlow = (flowData: any) => {
    setFlowName(flowData.name);
    setFlowDescription(flowData.description);
    setSelectedChatbot(flowData.chatbotId || '');
    setNodes(flowData.nodes);
    setEdges(flowData.edges);
    setSelectedNode(null);
    
    toast({
      title: "Fluxo carregado!",
      description: `Fluxo "${flowData.name}" foi carregado.`,
    });
  };

  const exportFlow = () => {
    const flowData = {
      name: flowName,
      description: flowDescription,
      chatbotId: selectedChatbot,
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${flowName.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importFlow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const flowData = JSON.parse(e.target?.result as string);
          loadFlow(flowData);
        } catch (error) {
          toast({
            title: "Erro ao importar",
            description: "Arquivo inválido ou corrompido.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const createNewFlow = () => {
    setFlowName('Novo Fluxo');
    setFlowDescription('');
    setSelectedChatbot('');
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNode(null);
    
    toast({
      title: "Novo fluxo criado!",
      description: "Um novo fluxo foi iniciado.",
    });
  };

  const clearAllFlows = () => {
    localStorage.removeItem('flows');
    setFlows([]);
    toast({
      title: "Fluxos limpos",
      description: "Todos os fluxos salvos foram removidos.",
    });
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
              Local
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={createNewFlow}>
              <Plus className="h-4 w-4 mr-2" />
              Novo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={saveFlowLocally}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Local
            </Button>
            <Button variant="outline" size="sm" onClick={exportFlow}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" asChild>
              <label>
                <Upload className="h-4 w-4 mr-2" />
                Importar
                <input
                  type="file"
                  accept=".json"
                  onChange={importFlow}
                  className="hidden"
                />
              </label>
            </Button>
            {selectedNode && selectedNode.type !== 'start' && (
              <Button variant="destructive" size="sm" onClick={deleteSelectedNode}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Nó
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Toolbar Lateral */}
        <div className="w-64 bg-card border-r p-4 flex flex-col gap-4">
          <NodeToolbar onAddNode={addNode} />
          
          {/* Fluxos Salvos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Fluxos Salvos
                </span>
                {flows.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAllFlows}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {flows.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum fluxo salvo
                </p>
              ) : (
                flows.map((flow) => (
                  <Button
                    key={flow.id}
                    variant="ghost"
                    className="w-full justify-start h-auto p-2"
                    onClick={() => loadFlow(flow)}
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm">{flow.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(flow.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Área do Flow */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
            deleteKeyCode={['Backspace', 'Delete']}
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
        <div className="w-80 bg-card border-l p-4 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações do Fluxo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="flow-name">Nome do Fluxo</Label>
                <Input
                  id="flow-name"
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  placeholder="Digite o nome do fluxo"
                />
              </div>
              <div>
                <Label htmlFor="flow-description">Descrição</Label>
                <Textarea
                  id="flow-description"
                  value={flowDescription}
                  onChange={(e) => setFlowDescription(e.target.value)}
                  placeholder="Descreva o propósito deste fluxo"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="chatbot-select">Chatbot Responsável</Label>
                <Select value={selectedChatbot} onValueChange={setSelectedChatbot}>
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
                {selectedChatbot && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Este chatbot será usado para interagir com os clientes neste fluxo
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Propriedades do Nó Selecionado */}
          {selectedNode && (
            <NodeProperties 
              selectedNode={selectedNode} 
              onUpdateNode={updateNodeData}
              onClose={() => setSelectedNode(null)}
              chatbots={chatbots}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder;
