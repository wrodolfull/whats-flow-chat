
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Eye, Edit, Trash2, Plus } from 'lucide-react';

const TemplateManager = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});

  const templates = [
    {
      id: 'welcome',
      name: 'Boas-vindas',
      category: 'UTILITY',
      status: 'APPROVED',
      content: 'Olá {{1}}, bem-vindo à nossa empresa! Como podemos ajudá-lo hoje?',
      variables: ['nome']
    },
    {
      id: 'order_confirmation',
      name: 'Confirmação de Pedido',
      category: 'UTILITY',
      status: 'APPROVED',
      content: 'Seu pedido #{{1}} foi confirmado! Valor: R$ {{2}}. Previsão de entrega: {{3}}.',
      variables: ['numero_pedido', 'valor', 'data_entrega']
    },
    {
      id: 'support_ticket',
      name: 'Ticket de Suporte',
      category: 'UTILITY',
      status: 'PENDING',
      content: 'Recebemos sua solicitação de suporte #{{1}}. Nossa equipe entrará em contato em até {{2}} horas.',
      variables: ['numero_ticket', 'tempo_resposta']
    }
  ];

  const handleSendTemplate = () => {
    if (selectedTemplate) {
      console.log('Enviando template:', selectedTemplate, 'com variáveis:', variables);
      // Aqui você integraria com a API do WhatsApp
      setVariables({});
    }
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Templates Disponíveis
          </CardTitle>
          <CardDescription>
            Selecione um template pré-aprovado para enviar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedTemplate === template.id ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">{template.name}</h3>
                <div className="flex gap-2">
                  <Badge variant={template.status === 'APPROVED' ? 'default' : 'secondary'}>
                    {template.status}
                  </Badge>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.content}</p>
              {template.variables.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {template.variables.map((variable, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Criar Novo Template
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview e Envio</CardTitle>
          <CardDescription>
            Configure as variáveis e envie o template
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedTemplateData ? (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Template Selecionado</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{selectedTemplateData.content}</p>
                </div>
              </div>

              {selectedTemplateData.variables.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Variáveis</Label>
                  {selectedTemplateData.variables.map((variable, index) => (
                    <div key={variable}>
                      <Label htmlFor={variable} className="text-xs text-gray-600">
                        {`{{${index + 1}}} - ${variable}`}
                      </Label>
                      <Input
                        id={variable}
                        placeholder={`Digite o valor para ${variable}`}
                        value={variables[variable] || ''}
                        onChange={(e) => setVariables({
                          ...variables,
                          [variable]: e.target.value
                        })}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <Label className="text-sm font-medium">Preview</Label>
                <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm">
                    {selectedTemplateData.variables.reduce((content, variable, index) => {
                      return content.replace(
                        `{{${index + 1}}}`,
                        variables[variable] || `[${variable}]`
                      );
                    }, selectedTemplateData.content)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSendTemplate}
                  className="flex-1"
                  disabled={selectedTemplateData.variables.some(v => !variables[v])}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Template
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Selecione um template para visualizar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateManager;
