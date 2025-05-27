
// Integração com a API da Shopee para recebimento e envio de mensagens

export interface ShopeeMessage {
  id: string;
  shopId: string;
  orderId?: string;
  from: string;
  fromName: string;
  timestamp: string;
  type: 'text' | 'image' | 'order_inquiry' | 'product_inquiry';
  content: string;
  imageUrl?: string;
  productId?: string;
  orderStatus?: string;
}

export interface ShopeeWebhookPayload {
  shop_id: string;
  timestamp: number;
  event_type: 'message' | 'order_update';
  data: {
    conversation_id: string;
    message?: {
      id: string;
      from_id: string;
      from_name: string;
      content: string;
      content_type: 'text' | 'image';
      created_time: number;
      image_url?: string;
    };
    order?: {
      order_sn: string;
      order_status: string;
      buyer_username: string;
      message_content: string;
    };
  };
}

export interface ShopeeConfig {
  partnerId: string;
  partnerKey: string;
  shopId: string;
  accessToken: string;
  refreshToken: string;
  webhookUrl: string;
  isActive: boolean;
}

export class ShopeeApiClient {
  private config: ShopeeConfig;
  private baseUrl = 'https://partner.shopeemobile.com';

  constructor(config: ShopeeConfig) {
    this.config = config;
  }

  // Gerar assinatura para autenticação
  private generateSignature(path: string, timestamp: number, accessToken?: string): string {
    const baseString = `${this.config.partnerId}${path}${timestamp}${accessToken || ''}`;
    // Em produção, usar crypto para HMAC-SHA256
    return btoa(baseString); // Simplificado para demonstração
  }

  // Enviar mensagem para comprador
  async sendMessage(conversationId: string, message: string): Promise<boolean> {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const path = `/api/v2/sellerchat/send_message`;
      const signature = this.generateSignature(path, timestamp, this.config.accessToken);

      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`,
        },
        body: JSON.stringify({
          partner_id: parseInt(this.config.partnerId),
          timestamp,
          sign: signature,
          shop_id: parseInt(this.config.shopId),
          conversation_id: conversationId,
          message_type: 'text',
          content: message,
        }),
      });

      const data = await response.json();
      return data.error === 0;
    } catch (error) {
      console.error('Erro ao enviar mensagem Shopee:', error);
      return false;
    }
  }

  // Enviar imagem para comprador
  async sendImage(conversationId: string, imageUrl: string, caption?: string): Promise<boolean> {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const path = `/api/v2/sellerchat/send_message`;
      const signature = this.generateSignature(path, timestamp, this.config.accessToken);

      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`,
        },
        body: JSON.stringify({
          partner_id: parseInt(this.config.partnerId),
          timestamp,
          sign: signature,
          shop_id: parseInt(this.config.shopId),
          conversation_id: conversationId,
          message_type: 'image',
          content: caption || '',
          image_url: imageUrl,
        }),
      });

      const data = await response.json();
      return data.error === 0;
    } catch (error) {
      console.error('Erro ao enviar imagem Shopee:', error);
      return false;
    }
  }

  // Obter informações do pedido
  async getOrderDetails(orderSn: string): Promise<any> {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const path = `/api/v2/order/get_order_detail`;
      const signature = this.generateSignature(path, timestamp, this.config.accessToken);

      const response = await fetch(`${this.baseUrl}${path}?${new URLSearchParams({
        partner_id: this.config.partnerId,
        timestamp: timestamp.toString(),
        sign: signature,
        shop_id: this.config.shopId,
        order_sn_list: orderSn,
      })}`, {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
        },
      });

      const data = await response.json();
      return data.response?.order_list?.[0] || null;
    } catch (error) {
      console.error('Erro ao obter detalhes do pedido:', error);
      return null;
    }
  }

  // Configurar webhook
  async setupWebhook(): Promise<boolean> {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const path = `/api/v2/sellerchat/set_webhook`;
      const signature = this.generateSignature(path, timestamp, this.config.accessToken);

      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`,
        },
        body: JSON.stringify({
          partner_id: parseInt(this.config.partnerId),
          timestamp,
          sign: signature,
          shop_id: parseInt(this.config.shopId),
          webhook_url: this.config.webhookUrl,
        }),
      });

      const data = await response.json();
      return data.error === 0;
    } catch (error) {
      console.error('Erro ao configurar webhook Shopee:', error);
      return false;
    }
  }
}

export class ShopeeWebhookHandler {
  private static shopeeClients: Map<string, ShopeeApiClient> = new Map();
  private static chatbotConfig: any = null;

  static addShopeeClient(shopId: string, config: ShopeeConfig) {
    this.shopeeClients.set(shopId, new ShopeeApiClient(config));
  }

  static setChatbotConfig(config: any) {
    this.chatbotConfig = config;
  }

  static async handleWebhook(payload: ShopeeWebhookPayload): Promise<void> {
    console.log('Webhook Shopee recebido:', payload);

    const client = this.shopeeClients.get(payload.shop_id);
    if (!client) {
      console.error('Cliente Shopee não encontrado para shop_id:', payload.shop_id);
      return;
    }

    if (payload.event_type === 'message' && payload.data.message) {
      await this.processMessage(payload.data.message, payload.data.conversation_id, client);
    } else if (payload.event_type === 'order_update' && payload.data.order) {
      await this.processOrderUpdate(payload.data.order, payload.data.conversation_id, client);
    }
  }

  private static async processMessage(
    message: any,
    conversationId: string,
    client: ShopeeApiClient
  ): Promise<void> {
    console.log(`Processando mensagem Shopee de ${message.from_name}:`, message.content);

    // Salvar mensagem no banco de dados
    await this.saveShopeeMessage({
      id: message.id,
      shopId: conversationId.split('_')[0],
      from: message.from_id,
      fromName: message.from_name,
      timestamp: new Date(message.created_time * 1000).toISOString(),
      type: message.content_type as 'text' | 'image',
      content: message.content,
      imageUrl: message.image_url
    });

    // Verificar se deve responder automaticamente
    if (this.chatbotConfig?.autoReply && this.shouldAutoReply(message.content)) {
      await this.generateAndSendReply(conversationId, message.content, client);
    }
  }

  private static async processOrderUpdate(
    order: any,
    conversationId: string,
    client: ShopeeApiClient
  ): Promise<void> {
    console.log('Processando atualização de pedido:', order);

    // Enviar notificação automática sobre status do pedido
    const statusMessages = {
      'UNPAID': 'Seu pedido foi criado! Aguardamos o pagamento.',
      'PAID': 'Pagamento confirmado! Seu pedido está sendo preparado.',
      'SHIPPED': 'Seu pedido foi enviado! Acompanhe o rastreamento.',
      'DELIVERED': 'Pedido entregue! Esperamos que goste da compra.',
      'CANCELLED': 'Seu pedido foi cancelado. Entre em contato se tiver dúvidas.'
    };

    const message = statusMessages[order.order_status as keyof typeof statusMessages];
    if (message) {
      await client.sendMessage(conversationId, message);
    }
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
    conversationId: string,
    userMessage: string,
    client: ShopeeApiClient
  ): Promise<void> {
    try {
      // Gerar resposta usando OpenAI
      const reply = await this.generateAIReply(userMessage);
      
      // Enviar resposta
      await client.sendMessage(conversationId, reply);
      
      // Salvar resposta no banco de dados
      await this.saveShopeeMessage({
        id: Date.now().toString(),
        shopId: conversationId.split('_')[0],
        from: 'bot',
        fromName: 'Assistente Virtual',
        timestamp: new Date().toISOString(),
        type: 'text',
        content: reply
      });
    } catch (error) {
      console.error('Erro ao gerar resposta Shopee:', error);
      
      // Enviar mensagem de erro padrão
      await client.sendMessage(conversationId, 'Desculpe, ocorreu um erro. Tente novamente.');
    }
  }

  private static async generateAIReply(userMessage: string): Promise<string> {
    // Contexto específico para Shopee
    const shopeeContext = `
    Você é um assistente de vendas da Shopee. Ajude com:
    - Informações sobre produtos
    - Status de pedidos
    - Dúvidas sobre entrega
    - Políticas de devolução
    - Suporte geral da loja
    
    Seja amigável, prestativo e direto nas respostas.
    `;

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
            content: this.chatbotConfig?.systemPrompt + '\n\n' + shopeeContext
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

  private static async saveShopeeMessage(messageData: ShopeeMessage): Promise<void> {
    // Salvar mensagem no banco de dados
    console.log('Salvando mensagem Shopee:', messageData);
    
    // Aqui seria implementada a integração com o banco de dados
    // Por enquanto, apenas log para demonstração
  }
}

// Utilitários para usar no frontend
export const shopeeUtils = {
  // Simular recebimento de webhook para testes
  simulateShopeeMessage: async (shopId: string, fromName: string, content: string) => {
    const payload: ShopeeWebhookPayload = {
      shop_id: shopId,
      timestamp: Date.now(),
      event_type: 'message',
      data: {
        conversation_id: `${shopId}_${Date.now()}`,
        message: {
          id: Date.now().toString(),
          from_id: 'buyer_123',
          from_name: fromName,
          content: content,
          content_type: 'text',
          created_time: Math.floor(Date.now() / 1000)
        }
      }
    };

    await ShopeeWebhookHandler.handleWebhook(payload);
  },

  // Simular atualização de pedido
  simulateOrderUpdate: async (shopId: string, orderSn: string, status: string) => {
    const payload: ShopeeWebhookPayload = {
      shop_id: shopId,
      timestamp: Date.now(),
      event_type: 'order_update',
      data: {
        conversation_id: `${shopId}_order_${orderSn}`,
        order: {
          order_sn: orderSn,
          order_status: status,
          buyer_username: 'comprador_teste',
          message_content: `Status do pedido ${orderSn} atualizado para ${status}`
        }
      }
    };

    await ShopeeWebhookHandler.handleWebhook(payload);
  }
};
