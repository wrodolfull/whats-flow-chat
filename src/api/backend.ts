
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const backendAPI = {
  // WhatsApp routes
  sendWhatsAppMessage: async (data: {
    to: string;
    message: string;
    number_id: string;
    access_token: string;
  }) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/whatsapp-send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  sendWhatsAppMedia: async (data: {
    to: string;
    media_url: string;
    media_type: string;
    caption?: string;
    number_id: string;
    access_token: string;
  }) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/whatsapp-media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Shopee routes
  sendShopeeMessage: async (data: {
    shop_id: string;
    access_token: string;
    conversation_id: string;
    message: string;
  }) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/shopee-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // OpenAI routes
  chatWithAI: async (data: {
    message: string;
    context?: string;
    openai_key: string;
  }) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/openai-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
};
