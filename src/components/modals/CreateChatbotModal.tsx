
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Bot, Brain, Mic, FileText, Settings } from 'lucide-react';

interface Chatbot {
  id: string;
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  status: 'active' | 'inactive' | 'training';
  assignedNumbers: string[];
  totalConversations: number;
  avgResponseTime: string;
  voiceEnabled: boolean;
  fileHandling: boolean;
  createdAt: string;
}

interface CreateChatbotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBotCreated: (bot: Omit<Chatbot, 'id' | 'assignedNumbers' | 'totalConversations' | 'avgResponseTime' | 'createdAt'>) => void;
  onBotUpdated: (bot: Omit<Chatbot, 'id' | 'assignedNumbers' | 'totalConversations' | 'avgResponseTime' | 'createdAt'>) => void;
  editingBot?: Chatbot | null;
}

const CreateChatbotModal = ({ 
  open, 
  onOpenChange, 
  onBotCreated, 
  onBotUpdated, 
  editingBot 
}: CreateChatbotModalProps) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    model: string;
    systemPrompt: string;
    status: 'active' | 'inactive' | 'training';
    voiceEnabled: boolean;
    fileHandling: boolean;
    openaiApiKey: string;
    elevenLabsApiKey: string;
    voiceId: string;
    temperature: number;
    maxTokens: number;
  }>({
    name: '',
    description: '',
    model: 'gpt-4o',
    systemPrompt: 'Você é um assistente virtual prestativo e amigável.',
    status: 'active',
    voiceEnabled: false,
    fileHandling: true,
    openaiApiKey: '',
    elevenLabsApiKey: '',
    voiceId: '',
    temperature: 0.7,
    maxTokens: 1000
  });
  
  const { toast } = useToast();

  const models = [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
  ];

  useEffect(() => {
    if (editingBot) {
      setFormData({
        name: editingBot.name,
        description: editingBot.description,
        model: editingBot.model,
        systemPrompt: editingBot.systemPrompt,
        status: editingBot.status,
        voiceEnabled: editingBot.voiceEnabled,
        fileHandling: editingBot.fileHandling,
        openaiApiKey: '',
        elevenLabsApiKey: '',
        voiceId: '',
        temperature: 0.7,
        maxTokens: 1000
      });
    } else {
      setFormData({
        name: '',
        description: '',
        model: 'gpt-4o',
        systemPrompt: 'Você é um assistente virtual prestativo e amigável.',
        status: 'active',
        voiceEnabled: false,
        fileHandling: true,
        openaiApiKey: '',
        elevenLabsApiKey: '',
        voiceId: '',
        temperature: 0.7,
        maxTokens: 1000
      });
    }
  }, [editingBot, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.systemPrompt) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (editingBot) {
      onBotUpdated(formData);
    } else {
      onBotCreated(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            {editingBot ? 'Editar Chatbot' : 'Criar Novo Chatbot'}
          </DialogTitle>
          <DialogDescription>
            Configure um chatbot com inteligência artificial para atendimento automatizado.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Chatbot *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Suporte Geral"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive' | 'training') => 
                      setFormData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="training">Treinando</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Breve descrição do propósito do chatbot"
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações de IA */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Configurações de IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model">Modelo de IA</Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="system-prompt">Prompt do Sistema *</Label>
                <Textarea
                  id="system-prompt"
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                  placeholder="Defina como o chatbot deve se comportar..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperatura</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Máximo de Tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    min="100"
                    max="4000"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recursos Avançados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recursos Avançados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  <div>
                    <Label>Resposta por Voz</Label>
                    <p className="text-sm text-gray-500">Gerar áudio das respostas</p>
                  </div>
                </div>
                <Switch
                  checked={formData.voiceEnabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, voiceEnabled: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <div>
                    <Label>Processar Arquivos</Label>
                    <p className="text-sm text-gray-500">Analisar documentos e imagens</p>
                  </div>
                </div>
                <Switch
                  checked={formData.fileHandling}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, fileHandling: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chaves de API</CardTitle>
              <CardDescription>
                Configure as chaves necessárias para o funcionamento do chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  value={formData.openaiApiKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                  placeholder="sk-..."
                />
              </div>
              
              {formData.voiceEnabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="elevenlabs-key">ElevenLabs API Key</Label>
                    <Input
                      id="elevenlabs-key"
                      type="password"
                      value={formData.elevenLabsApiKey}
                      onChange={(e) => setFormData(prev => ({ ...prev, elevenLabsApiKey: e.target.value }))}
                      placeholder="Para síntese de voz"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="voice-id">Voice ID</Label>
                    <Input
                      id="voice-id"
                      value={formData.voiceId}
                      onChange={(e) => setFormData(prev => ({ ...prev, voiceId: e.target.value }))}
                      placeholder="ID da voz no ElevenLabs"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingBot ? 'Atualizar' : 'Criar'} Chatbot
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatbotModal;
