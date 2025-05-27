
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, TestTube } from 'lucide-react';
import { webhookUtils } from '@/api/webhook';

const WebhookTester = () => {
  const [testData, setTestData] = useState({
    from: '+5511999999999',
    message: 'Olá, preciso de ajuda',
    type: 'text' as 'text' | 'audio'
  });
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  const handleTest = async () => {
    setTesting(true);
    
    try {
      await webhookUtils.simulateIncomingMessage(
        testData.from,
        testData.message,
        testData.type
      );
      
      toast({
        title: "Teste enviado!",
        description: "Mensagem de teste processada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Falha ao processar mensagem de teste.",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Testar Webhook
        </CardTitle>
        <CardDescription>
          Simule o recebimento de mensagens para testar o chatbot
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="from">Número do Remetente</Label>
          <Input
            id="from"
            value={testData.from}
            onChange={(e) => setTestData(prev => ({ ...prev, from: e.target.value }))}
            placeholder="+5511999999999"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Mensagem</Label>
          <Select
            value={testData.type}
            onValueChange={(value: 'text' | 'audio') => setTestData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texto</SelectItem>
              <SelectItem value="audio">Áudio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Mensagem</Label>
          <Textarea
            id="message"
            rows={3}
            value={testData.message}
            onChange={(e) => setTestData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Digite a mensagem de teste..."
          />
        </div>
        
        <Button 
          onClick={handleTest} 
          disabled={testing || !testData.from || !testData.message}
          className="w-full"
        >
          {testing ? (
            <>Testando...</>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Enviar Teste
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WebhookTester;
