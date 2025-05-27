import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import { Configuration, OpenAIApi } from "npm:openai@4.26.0";
import { ElevenLabsClient } from "npm:elevenlabs-node@2.0.3";

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

    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    // Handle webhook verification
    if (mode === 'subscribe' && token) {
      const { data: verifyTokens } = await supabase
        .from('whatsapp_numbers')
        .select('verify_token')
        .eq('verify_token', token);

      if (verifyTokens?.length) {
        return new Response(challenge, {
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
        });
      }

      return new Response('Forbidden', { status: 403 });
    }

    // Handle incoming messages
    const payload = await req.json();
    const { object, entry } = payload;

    if (object === 'whatsapp_business_account') {
      for (const entryItem of entry) {
        for (const change of entryItem.changes) {
          const { value } = change;
          
          if (value.messages) {
            for (const message of value.messages) {
              // Get phone number configuration
              const { data: phoneConfig } = await supabase
                .from('whatsapp_numbers')
                .select('*')
                .eq('phone_number_id', value.metadata.phone_number_id)
                .single();

              if (!phoneConfig) continue;

              // Process message based on type
              if (message.type === 'audio') {
                // Transcribe audio using OpenAI Whisper
                const openai = new OpenAIApi(new Configuration({
                  apiKey: phoneConfig.openai_api_key,
                }));

                const transcription = await openai.createTranscription(
                  message.audio.id,
                  'whisper-1'
                );

                message.text = { body: transcription.data.text };
              }

              // Generate AI response
              const completion = await openai.createChatCompletion({
                model: phoneConfig.ai_model || 'gpt-4',
                messages: [
                  { role: 'system', content: phoneConfig.system_prompt },
                  { role: 'user', content: message.text.body }
                ],
              });

              const aiResponse = completion.data.choices[0].message.content;

              // Generate voice response if enabled
              if (phoneConfig.voice_enabled) {
                const voice = new ElevenLabsClient({
                  apiKey: phoneConfig.elevenlabs_api_key,
                });

                const audioBuffer = await voice.generate({
                  text: aiResponse,
                  voiceId: phoneConfig.voice_id,
                });

                // Send audio response
                await sendWhatsAppAudio(
                  message.from,
                  audioBuffer,
                  phoneConfig.phone_number_id,
                  phoneConfig.access_token
                );
              }

              // Send text response
              await sendWhatsAppText(
                message.from,
                aiResponse,
                phoneConfig.phone_number_id,
                phoneConfig.access_token
              );

              // Save message to database
              await supabase.from('messages').insert([
                {
                  whatsapp_number_id: phoneConfig.id,
                  direction: 'inbound',
                  from: message.from,
                  content: message.text.body,
                  type: message.type,
                },
                {
                  whatsapp_number_id: phoneConfig.id,
                  direction: 'outbound',
                  to: message.from,
                  content: aiResponse,
                  type: 'text',
                }
              ]);
            }
          }
        }
      }
    }

    return new Response('OK', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function sendWhatsAppText(to: string, text: string, phoneNumberId: string, accessToken: string) {
  await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text }
    })
  });
}

async function sendWhatsAppAudio(to: string, audioBuffer: ArrayBuffer, phoneNumberId: string, accessToken: string) {
  // First upload the audio file
  const formData = new FormData();
  formData.append('file', new Blob([audioBuffer], { type: 'audio/mp3' }));
  formData.append('messaging_product', 'whatsapp');
  formData.append('type', 'audio/mp3');

  const uploadResponse = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/media`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: formData
  });

  const { id: mediaId } = await uploadResponse.json();

  // Then send the audio message
  await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'audio',
      audio: { id: mediaId }
    })
  });
}