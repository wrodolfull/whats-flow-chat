
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import { Configuration, OpenAIApi } from "npm:openai@4.26.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Verificar se é verificação do webhook
    const url = new URL(req.url);
    const verification = url.searchParams.get('verification');
    
    if (verification) {
      // Retornar challenge para verificação do webhook Shopee
      return new Response(verification, {
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      });
    }

    // Processar webhook da Shopee
    const payload = await req.json();
    const { shop_id, event_type, data } = payload;

    console.log('Webhook Shopee recebido:', payload);

    // Buscar configuração da loja
    const { data: shopConfig } = await supabase
      .from('shopee_configs')
      .select('*')
      .eq('shop_id', shop_id)
      .eq('is_active', true)
      .single();

    if (!shopConfig) {
      console.log('Configuração da loja não encontrada:', shop_id);
      return new Response('Shop not configured', { status: 404 });
    }

    if (event_type === 'message' && data.message) {
      await processShopeeMessage(data.message, data.conversation_id, shopConfig, supabase);
    } else if (event_type === 'order_update' && data.order) {
      await processOrderUpdate(data.order, data.conversation_id, shopConfig, supabase);
    }

    return new Response('OK', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro no webhook Shopee:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processShopeeMessage(message: any, conversationId: string, shopConfig: any, supabase: any) {
  console.log('Processando mensagem Shopee:', message);

  // Salvar mensagem no banco de dados
  const { data: savedMessage } = await supabase
    .from('messages')
    .insert([
      {
        shopee_shop_id: shopConfig.shop_id,
        platform: 'shopee',
        direction: 'inbound',
        from: message.from_id,
        from_name: message.from_name,
        content: message.content,
        type: message.content_type,
        conversation_id: conversationId,
        image_url: message.image_url,
        timestamp: new Date(message.created_time * 1000).toISOString(),
      }
    ])
    .select()
    .single();

  // Verificar se deve responder automaticamente
  if (shopConfig.auto_reply_enabled && shouldAutoReply(message.content, shopConfig)) {
    await generateAndSendShopeeReply(conversationId, message.content, shopConfig, supabase);
  }
}

async function processOrderUpdate(order: any, conversationId: string, shopConfig: any, supabase: any) {
  console.log('Processando atualização de pedido:', order);

  // Mapear status para mensagens em português
  const statusMessages = {
    'UNPAID': 'Seu pedido foi criado! Aguardamos o pagamento para processar.',
    'PAID': 'Pagamento confirmado! Seu pedido está sendo preparado para envio.',
    'SHIPPED': 'Seu pedido foi enviado! Acompanhe o rastreamento pelo app da Shopee.',
    'DELIVERED': 'Pedido entregue com sucesso! Esperamos que goste da sua compra.',
    'CANCELLED': 'Seu pedido foi cancelado. Entre em contato se tiver dúvidas.',
    'RETURNED': 'Solicitação de devolução recebida. Processaremos em breve.'
  };

  const message = statusMessages[order.order_status as keyof typeof statusMessages];
  
  if (message) {
    await sendShopeeMessage(conversationId, message, shopConfig);
    
    // Salvar mensagem automática no banco
    await supabase
      .from('messages')
      .insert([
        {
          shopee_shop_id: shopConfig.shop_id,
          platform: 'shopee',
          direction: 'outbound',
          to: conversationId,
          content: message,
          type: 'text',
          conversation_id: conversationId,
          is_automated: true,
        }
      ]);
  }
}

function shouldAutoReply(content: string, shopConfig: any): boolean {
  if (!shopConfig.auto_reply_enabled) return false;
  
  // Verificar horário de funcionamento
  if (shopConfig.working_hours_enabled) {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const startTime = parseInt(shopConfig.working_hours_start?.replace(':', '') || '0900');
    const endTime = parseInt(shopConfig.working_hours_end?.replace(':', '') || '1800');
    
    if (currentTime < startTime || currentTime > endTime) {
      return false;
    }
  }

  // Verificar palavras-chave de ativação
  const keywords = shopConfig.keyword_triggers || [];
  const contentLower = content.toLowerCase();
  
  if (keywords.length > 0) {
    return keywords.some((keyword: string) => contentLower.includes(keyword.toLowerCase()));
  }

  return true;
}

async function generateAndSendShopeeReply(conversationId: string, userMessage: string, shopConfig: any, supabase: any) {
  try {
    // Contexto específico para Shopee
    const shopeeContext = `
    Você é um assistente de vendas da Shopee especializado em:
    - Informações sobre produtos e catálogo
    - Status e rastreamento de pedidos
    - Dúvidas sobre entrega e frete
    - Políticas de devolução e troca
    - Promoções e cupons de desconto
    - Suporte geral da loja
    
    Seja sempre amigável, prestativo e direto. Use emojis quando apropriado.
    Sempre incentive o cliente a finalizar a compra ou recomendar produtos relacionados.
    `;

    const openai = new OpenAIApi(new Configuration({
      apiKey: shopConfig.openai_api_key,
    }));

    const completion = await openai.createChatCompletion({
      model: shopConfig.ai_model || 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: (shopConfig.system_prompt || '') + '\n\n' + shopeeContext 
        },
        { role: 'user', content: userMessage }
      ],
      max_tokens: shopConfig.max_tokens || 1000,
      temperature: shopConfig.temperature || 0.7,
    });

    const aiResponse = completion.data.choices[0].message?.content;
    
    if (aiResponse) {
      // Enviar resposta para Shopee
      await sendShopeeMessage(conversationId, aiResponse, shopConfig);
      
      // Salvar resposta no banco de dados
      await supabase
        .from('messages')
        .insert([
          {
            shopee_shop_id: shopConfig.shop_id,
            platform: 'shopee',
            direction: 'outbound',
            to: conversationId,
            content: aiResponse,
            type: 'text',
            conversation_id: conversationId,
            is_automated: true,
          }
        ]);
    }
  } catch (error) {
    console.error('Erro ao gerar resposta Shopee:', error);
    
    // Enviar mensagem de erro padrão
    const fallbackMessage = 'Olá! Obrigado pela sua mensagem. Nossa equipe retornará em breve! 😊';
    await sendShopeeMessage(conversationId, fallbackMessage, shopConfig);
  }
}

async function sendShopeeMessage(conversationId: string, message: string, shopConfig: any) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const path = `/api/v2/sellerchat/send_message`;
    
    // Gerar assinatura (implementação simplificada)
    const baseString = `${shopConfig.partner_id}${path}${timestamp}${shopConfig.access_token}`;
    const signature = btoa(baseString); // Em produção, usar HMAC-SHA256
    
    const response = await fetch(`https://partner.shopeemobile.com${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${shopConfig.access_token}`,
      },
      body: JSON.stringify({
        partner_id: parseInt(shopConfig.partner_id),
        timestamp,
        sign: signature,
        shop_id: parseInt(shopConfig.shop_id),
        conversation_id: conversationId,
        message_type: 'text',
        content: message,
      }),
    });

    const data = await response.json();
    console.log('Mensagem Shopee enviada:', data);
    
    return data.error === 0;
  } catch (error) {
    console.error('Erro ao enviar mensagem Shopee:', error);
    return false;
  }
}
