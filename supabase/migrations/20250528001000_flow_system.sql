
/*
  # Flow System Schema

  1. New Tables
    - `flows`
      - Stores chatbot flows with metadata
    - `flow_nodes`
      - Individual nodes within flows
    - `flow_edges`
      - Connections between nodes
    - `flow_executions`
      - Runtime execution tracking
    - `flow_execution_logs`
      - Detailed execution logs

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create flows table
CREATE TABLE IF NOT EXISTS flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  description text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
  created_by uuid REFERENCES auth.users(id),
  whatsapp_number_id uuid REFERENCES whatsapp_numbers(id),
  trigger_conditions jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}'
);

-- Create flow_nodes table
CREATE TABLE IF NOT EXISTS flow_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  flow_id uuid REFERENCES flows(id) ON DELETE CASCADE,
  node_id text NOT NULL,
  type text NOT NULL CHECK (type IN ('start', 'message', 'condition', 'action', 'end')),
  position jsonb NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  UNIQUE(flow_id, node_id)
);

-- Create flow_edges table
CREATE TABLE IF NOT EXISTS flow_edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  flow_id uuid REFERENCES flows(id) ON DELETE CASCADE,
  edge_id text NOT NULL,
  source text NOT NULL,
  target text NOT NULL,
  source_handle text,
  target_handle text,
  data jsonb DEFAULT '{}',
  UNIQUE(flow_id, edge_id)
);

-- Create flow_executions table
CREATE TABLE IF NOT EXISTS flow_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  flow_id uuid REFERENCES flows(id),
  whatsapp_number_id uuid REFERENCES whatsapp_numbers(id),
  contact_number text NOT NULL,
  status text DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'paused')),
  current_node_id text,
  context jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}'
);

-- Create flow_execution_logs table
CREATE TABLE IF NOT EXISTS flow_execution_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  execution_id uuid REFERENCES flow_executions(id) ON DELETE CASCADE,
  node_id text NOT NULL,
  action text NOT NULL,
  input_data jsonb,
  output_data jsonb,
  status text NOT NULL CHECK (status IN ('success', 'error', 'warning')),
  error_message text,
  duration_ms integer
);

-- Enable RLS
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_execution_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for flows
CREATE POLICY "Users can view flows they created or have access to"
  ON flows
  FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
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

CREATE POLICY "Users can create flows"
  ON flows
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their flows"
  ON flows
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager')
    )
  );

-- Create policies for flow_nodes
CREATE POLICY "Users can view nodes from accessible flows"
  ON flow_nodes
  FOR SELECT
  TO authenticated
  USING (
    flow_id IN (
      SELECT id FROM flows 
      WHERE created_by = auth.uid() OR
      whatsapp_number_id IN (
        SELECT id FROM whatsapp_numbers 
        WHERE assigned_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage nodes in their flows"
  ON flow_nodes
  FOR ALL
  TO authenticated
  USING (
    flow_id IN (
      SELECT id FROM flows 
      WHERE created_by = auth.uid()
    )
  );

-- Create policies for flow_edges
CREATE POLICY "Users can view edges from accessible flows"
  ON flow_edges
  FOR SELECT
  TO authenticated
  USING (
    flow_id IN (
      SELECT id FROM flows 
      WHERE created_by = auth.uid() OR
      whatsapp_number_id IN (
        SELECT id FROM whatsapp_numbers 
        WHERE assigned_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage edges in their flows"
  ON flow_edges
  FOR ALL
  TO authenticated
  USING (
    flow_id IN (
      SELECT id FROM flows 
      WHERE created_by = auth.uid()
    )
  );

-- Create policies for flow_executions
CREATE POLICY "Users can view executions from their numbers"
  ON flow_executions
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

-- Create policies for flow_execution_logs
CREATE POLICY "Users can view execution logs from accessible executions"
  ON flow_execution_logs
  FOR SELECT
  TO authenticated
  USING (
    execution_id IN (
      SELECT id FROM flow_executions 
      WHERE whatsapp_number_id IN (
        SELECT id FROM whatsapp_numbers 
        WHERE assigned_user_id = auth.uid()
      )
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_flows_updated_at
  BEFORE UPDATE ON flows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flow_executions_updated_at
  BEFORE UPDATE ON flow_executions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_flows_created_by ON flows(created_by);
CREATE INDEX idx_flows_whatsapp_number_id ON flows(whatsapp_number_id);
CREATE INDEX idx_flows_status ON flows(status);
CREATE INDEX idx_flow_nodes_flow_id ON flow_nodes(flow_id);
CREATE INDEX idx_flow_edges_flow_id ON flow_edges(flow_id);
CREATE INDEX idx_flow_executions_flow_id ON flow_executions(flow_id);
CREATE INDEX idx_flow_executions_contact_number ON flow_executions(contact_number);
CREATE INDEX idx_flow_executions_status ON flow_executions(status);
CREATE INDEX idx_flow_execution_logs_execution_id ON flow_execution_logs(execution_id);
