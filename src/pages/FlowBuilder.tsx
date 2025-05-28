
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Zap
} from 'lucide-react';

import StartNode from '@/components/flow/StartNode';
import MessageNode from '@/components/flow/MessageNode';
import ConditionNode from '@/components/flow/ConditionNode';
import ActionNode from '@/components/flow/ActionNode';
import EndNode from '@/components/flow/EndNode';
import NodeToolbar from '@/components/flow/NodeToolbar';
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
    position: { x: 250, y: 0 },
    data: { label: 'Início do Atendimento' },
  },
];

const initialEdges: Edge[] = [];

const FlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentFlowId, setCurrentFlowId] = useState<string | null>(null);
  const [flowName, setFlowName] = useState('Novo Fluxo');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Load flow structure when flowId changes
  useEffect(() => {
    if (currentFlowId) {
      loadFlowStructure(currentFlowId);
    }
  }, [currentFlowId]);

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${Date.now()}`,
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

  const saveFlow = async () => {
    setIsSaving(true);
    try {
      let flowId = currentFlowId;
      
      // Create flow if it doesn't exist
      if (!flowId) {
        const flowData = await flowsAPI.createFlow({
          name: flowName,
          description: 'Fluxo criado no construtor visual',
          status: 'draft',
          created_by: '', // This will be set by the backend
          trigger_conditions: {},
          metadata: {}
        });
        flowId = flowData.id;
        setCurrentFlowId(flowId);
      }

      // Save flow structure
      await flowsAPI.saveFlowStructure(flowId, nodes, edges);
      
      toast({
        title: "Fluxo salvo!",
        description: "O fluxo foi salvo com sucesso.",
      });
    } catch (error) {
      console.error('Error saving flow:', error);
      toast({
        title: "Erro ao salvar",
        description: "Erro ao salvar o fluxo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const loadFlowStructure = async (flowId: string) => {
    setIsLoading(true);
    try {
      const structure = await flowsAPI.getFlowStructure(flowId);
      
      // Convert database nodes to React Flow nodes
      const flowNodes = structure.nodes.map((node: any) => ({
        id: node.node_id,
        type: node.type,
        position: node.position,
        data: node.data
      }));

      // Convert database edges to React Flow edges
      const flowEdges = structure.edges.map((edge: any) => ({
        id: edge.edge_id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.source_handle,
        targetHandle: edge.target_handle,
        data: edge.data
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (error) {
      console.error('Error loading flow structure:', error);
      toast({
        title: "Erro ao carregar",
        description: "Erro ao carregar a estrutura do fluxo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewFlow = async () => {
    try {
      const flowData = await flowsAPI.createFlow({
        name: 'Novo Fluxo',
        description: 'Fluxo criado no construtor visual',
        status: 'draft',
        created_by: '', // This will be set by the backend
        trigger_conditions: {},
        metadata: {}
      });
      
      setCurrentFlowId(flowData.id);
      setFlowName(flowData.name);
      setNodes(initialNodes);
      setEdges(initialEdges);
      
      toast({
        title: "Novo fluxo criado!",
        description: "Um novo fluxo foi criado com sucesso.",
      });
    } catch (error) {
      console.error('Error creating flow:', error);
      toast({
        title: "Erro ao criar fluxo",
        description: "Erro ao criar um novo fluxo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const testFlow = async () => {
    if (!currentFlowId) {
      toast({
        title: "Salve o fluxo primeiro",
        description: "Você precisa salvar o fluxo antes de testá-lo.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await flowsAPI.testFlow(currentFlowId, {
        input_message: 'Teste',
        contact_number: '+5511999999999',
        context: {}
      });
      
      toast({
        title: "Teste executado!",
        description: `Resultado do teste: ${result.status}`,
      });
    } catch (error) {
      console.error('Error testing flow:', error);
      toast({
        title: "Erro no teste",
        description: "Erro ao executar o teste do fluxo.",
        variant: "destructive",
      });
    }
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
              {currentFlowId ? `ID: ${currentFlowId.slice(0, 8)}` : 'Novo Fluxo'}
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
              onClick={saveFlow}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button size="sm" onClick={testFlow}>
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
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Carregando fluxo...</p>
              </div>
            </div>
          ) : (
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
          )}
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
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome do Fluxo</label>
                  <input
                    type="text"
                    value={flowName}
                    onChange={(e) => setFlowName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
                {currentFlowId && (
                  <div>
                    <label className="text-sm font-medium">ID do Fluxo</label>
                    <p className="text-sm text-muted-foreground mt-1">{currentFlowId}</p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Selecione um nó para editar suas propriedades
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder;
