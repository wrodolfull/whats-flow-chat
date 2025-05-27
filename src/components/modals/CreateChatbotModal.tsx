
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Bot, Brain, Mic, FileText } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model: 'gpt-4o',
    systemPrompt: '',
    status: 'active' as const,
    voiceEnabled: false,
    fileHandling: false,
    openaiApiKey: '',
    elevenLabsApiKey: '',
    voiceId: '9BWtsMINqrJLrRacOk9x',
    temperature: 0.7,
    maxTokens: 1000
  });

  const { toast } = useToast();

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
        voiceId: '9BWtsMINqrJLrRacOk9x',
        temperature: 0.7,
        maxTokens: 1000
      });
    } else {
      setFormData({
        name: '',
        description: '',
        model: 'gpt-4o',
        systemPrompt: 'Você é um assistente virtual amigável e prestativo. Responda de forma clara e concisa.',
        status: 'active',
        voiceEnabled: false,
        fileHandling: false,
        openaiApiKey: '',
        elevenLabsApiKey: '',
        voiceId: '9BWtsMINqrJLrRacOk9x',
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

    if (!formData.openaiApiKey) {
      toast({
        title: "Erro",
        description: "API Key da OpenAI é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    if (formData.voiceEnabled && !formData.elevenLabsApiKey) {
      toast({
        title: "Erro",
        description: "API Key da ElevenLabs é obrigatória para usar voz.",
        variant: "destructive",
      });
      return;
    }

    const botData = {
      name: formData.name,
      description: formData.description,
      model: formData.model,
      systemPrompt: formData.systemPrompt,
      status: formData.status,
      voiceEnabled: formData.voiceEnabled,
      fileHandling: formData.fileHandling
    };

    if (editingBot) {
      onBotUpdated(botData);
    } else {
      onBotCreated(botData);
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
            Configure um chatbot com inteligência artificial para atendimento automático.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="ai">IA</TabsTrigger>
            <TabsTrigger value="voice">Voz</TabsTrigger>
            <TabsTrigger value="advanced">Avançado</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="space-y-4">
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
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva a função do chatbot"
                  rows={3}
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
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">API Key OpenAI *</Label>
                <Input
                  id="openai-key"
                  type="password"
                  value={formData.openaiApiKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                  placeholder="sk-..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Modelo IA</Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview</SelectItem>
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
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={formData.temperature}
                    onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="voice" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="voice-enabled">Habilitar Voz</Label>
                  <p className="text-sm text-gray-500">Permite entender e responder por áudio</p>
                </div>
                <Switch
                  id="voice-enabled"
                  checked={formData.voiceEnabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, voiceEnabled: checked }))}
                />
              </div>

              {formData.voiceEnabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="elevenlabs-key">API Key ElevenLabs</Label>
                    <Input
                      id="elevenlabs-key"
                      type="password"
                      value={formData.elevenLabsApiKey}
                      onChange={(e) => setFormData(prev => ({ ...prev, elevenLabsApiKey: e.target.value }))}
                      placeholder="sk_..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="voice-id">Voz</Label>
                    <Select
                      value={formData.voiceId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, voiceId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9BWtsMINqrJLrRacOk9x">Aria</SelectItem>
                        <SelectItem value="EXAVITQu4vr4xnSDxMaL">Sarah</SelectItem>
                        <SelectItem value="TX3LPaxmHKxFdv7VOQHJ">Liam</SelectItem>
                        <SelectItem value="XB0fDUnXU5powFXDhCwa">Charlotte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="file-handling">Processamento de Arquivos</Label>
                  <p className="text-sm text-gray-500">Permite processar imagens, documentos e áudios</p>
                </div>
                <Switch
                  id="file-handling"
                  checked={formData.fileHandling}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, fileHandling: checked }))}
                />
              </div>
            </TabsContent>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingBot ? 'Atualizar' : 'Criar'} Chatbot
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatbotModal;
