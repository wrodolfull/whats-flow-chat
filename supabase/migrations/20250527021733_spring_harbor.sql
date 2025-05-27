/*
  # WhatsApp Integration Schema

  1. New Tables
    - `whatsapp_numbers`
      - Configuration for each WhatsApp number
      - Stores API keys, webhooks, and settings
    - `messages`
      - Stores all messages sent and received
      - Links to whatsapp_numbers and users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create whatsapp_numbers table
CREATE TABLE IF NOT EXISTS whatsapp_numbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  phone_number text NOT NULL,
  display_name text NOT NULL,
  phone_number_id text NOT NULL UNIQUE,
  access_token text NOT NULL,
  business_account_id text,
  status text DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
  assigned_user_id uuid REFERENCES auth.users(id),
  webhook_url text,
  verify_token text,
  
  -- AI Configuration
  openai_api_key text,
  ai_model text DEFAULT 'gpt-4',
  system_prompt text,
  max_tokens integer DEFAULT 1000,
  temperature float DEFAULT 0.7,
  
  -- Voice Configuration
  voice_enabled boolean DEFAULT false,
  elevenlabs_api_key text,
  voice_id text,
  voice_model text,
  
  -- Auto-reply Configuration
  auto_reply boolean DEFAULT true,
  working_hours_enabled boolean DEFAULT false,
  working_hours_start time,
  working_hours_end time,
  working_hours_timezone text
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  whatsapp_number_id uuid REFERENCES whatsapp_numbers(id) NOT NULL,
  direction text NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_id text,
  from_number text,
  to_number text,
  type text NOT NULL CHECK (type IN ('text', 'audio', 'image', 'document', 'video')),
  content text,
  media_url text,
  status text DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  metadata jsonb
);

-- Enable RLS
ALTER TABLE whatsapp_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their assigned numbers"
  ON whatsapp_numbers
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = assigned_user_id OR 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Users can view messages for their numbers"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    whatsapp_number_id IN (
      SELECT id FROM whatsapp_numbers 
      WHERE assigned_user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for whatsapp_numbers
CREATE TRIGGER update_whatsapp_numbers_updated_at
  BEFORE UPDATE ON whatsapp_numbers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();