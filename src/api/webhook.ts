
// Simulação das rotas da API Meta para webhook
// Em produção, isso seria implementado no backend

export interface WhatsAppMessage {
  id: string;
  from: string;
  timestamp: string;
  type: 'text' | 'audio' | 'image' | 'document' | 'video';
  text?: {
    body: string;
  };
  audio?: {
    id: string;
    mime_type: string;
  };
  image?: {
    id: string;
    mime_type: string;
    caption?: string;
  };
  document?: {
    id: string;
    filename: string;
    mime_type: string;
  };
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: WhatsAppMessage[];
        statuses?: Array<{
          id: string;
          status: 'sent' | 'delivered' | 'read' | 'failed';
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

export class WhatsAppWebhookHandler {
  private static apiKey: string = '';
  private static chatbotConfig: any = null;

  static setApiKey(key: string) {
    this.apiKey = key;
  }

  static setChatbotConfig(config: any) {
    this.chatbotConfig = config;
  }

  static async verifyWebhook(token: string, challenge: string): Promise<string | null> {
    // Verificar se o token corresponde ao token de verificação configurado
    const expectedToken = 'verify123'; // Em produção, pegar do banco de dados
    
    if (token === expectedToken) {
      return challenge;
    }
    
    return null;
  }

  static async handleIncomingMessage(payload: WhatsAppWebhookPayload): Promise<void> {
    console.log('Webhook payload recebido:', payload);

    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages') {
          const { messages, metadata, contacts } = change.value;
          
          if (messages) {
            for (const message of messages) {
              await this.processMessage(message, metadata, contacts);
            }
          }
        }
      }
    }
  }

  private static async processMessage(
    message: WhatsAppMessage, 
    metadata: any, 
    contacts?: any[]
  ): Promise<void> {
    const phoneNumberId = metadata.phone_number_id;
    const contact = contacts?.[0];
    
    console.log(`Processando mensagem de ${message.from}:`, message);

    // Processar diferentes tipos de mensagem
    let messageContent = '';
    
    switch (message.type) {
      case 'text':
        messageContent = message.text?.body || '';
        break;
      case 'audio':
        messageContent = '[Áudio recebido]';
        // Aqui seria processado o áudio se o chatbot estiver configurado para entender áudio
        if (this.chatbotConfig?.voiceEnabled) {
          await this.processAudioMessage(message.audio?.id);
        }
        break;
      case 'image':
        messageContent = message.image?.caption || '[Imagem recebida]';
        break;
      case 'document':
        messageContent = `[Documento: ${message.document?.filename}]`;
        break;
    }

    // Verificar se deve responder automaticamente
    if (this.chatbotConfig?.autoReply && this.shouldAutoReply(messageContent)) {
      await this.generateAndSendReply(message.from, messageContent, phoneNumberId);
    }

    // Salvar mensagem no banco de dados
    await this.saveMessage({
      id: message.id,
      from: message.from,
      to: phoneNumberId,
      content: messageContent,
      type: message.type,
      timestamp: message.timestamp,
      contact: contact?.profile?.name || message.from
    });
  }

  private static shouldAutoReply(content: string): boolean {
    if (!this.chatbotConfig?.autoReply) return false;
    
    // Verificar horário de funcionamento
    if (this.chatbotConfig.workingHours?.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const startTime = parseInt(this.chatbotConfig.workingHours.start.replace(':', ''));
      const endTime = parseInt(this.chatbotConfig.workingHours.end.replace(':', ''));
      
      if (currentTime < startTime || currentTime > endTime) {
        return false;
      }
    }

    // Verificar palavras-chave de ativação
    const keywords = this.chatbotConfig.keywordTriggers || [];
    const contentLower = content.toLowerCase();
    
    if (keywords.length > 0) {
      return keywords.some((keyword: string) => contentLower.includes(keyword.toLowerCase()));
    }

    return true;
  }

  private static async generateAndSendReply(
    to: string, 
    userMessage: string, 
    phoneNumberId: string
  ): Promise<void> {
    try {
      // Gerar resposta usando OpenAI
      const reply = await this.generateAIReply(userMessage);
      
      // Enviar resposta
      await this.sendMessage(to, reply, phoneNumberId);
      
      // Se voz estiver habilitada, gerar e enviar áudio
      if (this.chatbotConfig?.voiceEnabled) {
        await this.generateAndSendVoiceReply(to, reply, phoneNumberId);
      }
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      
      // Enviar mensagem de erro padrão
      await this.sendMessage(to, 'Desculpe, ocorreu um erro. Tente novamente.', phoneNumberId);
    }
  }

  private static async generateAIReply(userMessage: string): Promise<string> {
    // Simular chamada para OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.chatbotConfig?.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.chatbotConfig?.model || 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: this.chatbotConfig?.systemPrompt || 'Você é um assistente virtual prestativo.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: this.chatbotConfig?.maxTokens || 1000,
        temperature: this.chatbotConfig?.temperature || 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';
  }

  private static async processAudioMessage(audioId?: string): Promise<string> {
    if (!audioId) return '';
    
    // Aqui seria implementado o processamento de áudio
    // 1. Baixar o arquivo de áudio do WhatsApp
    // 2. Converter para texto usando OpenAI Whisper ou similar
    // 3. Retornar o texto transcrito
    
    return '[Áudio processado]';
  }

  private static async generateAndSendVoiceReply(
    to: string, 
    text: string, 
    phoneNumberId: string
  ): Promise<void> {
    try {
      // Gerar áudio usando ElevenLabs
      const audioBuffer = await this.generateVoice(text);
      
      // Upload do áudio para o WhatsApp e envio
      await this.sendAudioMessage(to, audioBuffer, phoneNumberId);
    } catch (error) {
      console.error('Erro ao gerar áudio:', error);
    }
  }

  private static async generateVoice(text: string): Promise<ArrayBuffer> {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + this.chatbotConfig.voiceId, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.chatbotConfig?.elevenLabsApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: this.chatbotConfig?.voiceModel || 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      }),
    });

    return await response.arrayBuffer();
  }

  private static async sendMessage(
    to: string, 
    message: string, 
    phoneNumberId: string
  ): Promise<void> {
    // Simular delay configurado
    if (this.chatbotConfig?.responseDelay) {
      await new Promise(resolve => setTimeout(resolve, this.chatbotConfig.responseDelay));
    }

    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: {
          body: message
        }
      }),
    });

    const data = await response.json();
    console.log('Mensagem enviada:', data);
  }

  private static async sendAudioMessage(
    to: string, 
    audioBuffer: ArrayBuffer, 
    phoneNumberId: string
  ): Promise<void> {
    // 1. Upload do áudio para o WhatsApp Media API
    // 2. Enviar mensagem de áudio usando o media ID
    console.log('Enviando mensagem de áudio para:', to);
  }

  private static async saveMessage(messageData: any): Promise<void> {
    // Salvar mensagem no banco de dados
    console.log('Salvando mensagem:', messageData);
  }
}

// Funções utilitárias para usar no frontend
export const webhookUtils = {
  // Simular recebimento de webhook para testes
  simulateIncomingMessage: async (from: string, message: string, type: 'text' | 'audio' = 'text') => {
    const payload: WhatsAppWebhookPayload = {
      object: 'whatsapp_business_account',
      entry: [{
        id: '123456',
        changes: [{
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: '+55 11 99999-9999',
              phone_number_id: '123456789'
            },
            contacts: [{
              profile: { name: 'Usuário Teste' },
              wa_id: from
            }],
            messages: [{
              id: Date.now().toString(),
              from,
              timestamp: Date.now().toString(),
              type,
              text: type === 'text' ? { body: message } : undefined
            }]
          },
          field: 'messages'
        }]
      }]
    };

    await WhatsAppWebhookHandler.handleIncomingMessage(payload);
  }
};
