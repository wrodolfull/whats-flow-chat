
export interface Flow {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'inactive';
  created_by: string;
  whatsapp_number_id?: string;
  trigger_conditions: Record<string, any>;
  metadata: Record<string, any>;
}

export interface FlowNode {
  id: string;
  flow_id: string;
  node_id: string;
  type: 'start' | 'message' | 'condition' | 'action' | 'end';
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface FlowEdge {
  id: string;
  flow_id: string;
  edge_id: string;
  source: string;
  target: string;
  source_handle?: string;
  target_handle?: string;
  data: Record<string, any>;
}

export interface FlowExecution {
  id: string;
  created_at: string;
  updated_at: string;
  flow_id: string;
  whatsapp_number_id: string;
  contact_number: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  current_node_id?: string;
  context: Record<string, any>;
  metadata: Record<string, any>;
}

export interface FlowExecutionLog {
  id: string;
  created_at: string;
  execution_id: string;
  node_id: string;
  action: string;
  input_data?: Record<string, any>;
  output_data?: Record<string, any>;
  status: 'success' | 'error' | 'warning';
  error_message?: string;
  duration_ms?: number;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const flowsAPI = {
  // Flow management
  getFlows: async () => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/flows`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getFlow: async (flowId: string) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/flows/${flowId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  createFlow: async (flow: Omit<Flow, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/flows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flow),
    });
    return response.json();
  },

  updateFlow: async (flowId: string, flow: Partial<Flow>) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/flows/${flowId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flow),
    });
    return response.json();
  },

  deleteFlow: async (flowId: string) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/flows/${flowId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // Flow structure management
  saveFlowStructure: async (flowId: string, nodes: FlowNode[], edges: FlowEdge[]) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/flows/${flowId}/structure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nodes, edges }),
    });
    return response.json();
  },

  getFlowStructure: async (flowId: string) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/flows/${flowId}/structure`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // Flow execution
  executeFlow: async (flowId: string, data: {
    whatsapp_number_id: string;
    contact_number: string;
    initial_context?: Record<string, any>;
  }) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/flows/${flowId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getFlowExecutions: async (flowId?: string) => {
    const url = flowId 
      ? `${SUPABASE_URL}/functions/v1/flows/${flowId}/executions`
      : `${SUPABASE_URL}/functions/v1/flow-executions`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getExecutionLogs: async (executionId: string) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/flow-executions/${executionId}/logs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // Flow testing
  testFlow: async (flowId: string, testData: {
    input_message: string;
    contact_number: string;
    context?: Record<string, any>;
  }) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/flows/${flowId}/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    return response.json();
  }
};
