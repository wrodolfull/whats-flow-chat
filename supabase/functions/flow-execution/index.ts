
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FlowNode {
  node_id: string;
  type: string;
  data: any;
}

interface FlowEdge {
  source: string;
  target: string;
  source_handle?: string;
  target_handle?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const url = new URL(req.url)
    const pathParts = url.pathname.split('/').filter(Boolean)
    const flowId = pathParts[pathParts.length - 2] // flows/:id/execute

    // POST /flows/:id/execute - Execute flow
    if (req.method === 'POST') {
      const { whatsapp_number_id, contact_number, initial_context = {} } = await req.json()

      // Create execution record
      const { data: execution, error: executionError } = await supabaseClient
        .from('flow_executions')
        .insert({
          flow_id: flowId,
          whatsapp_number_id,
          contact_number,
          status: 'running',
          context: initial_context
        })
        .select()
        .single()

      if (executionError) throw executionError

      // Get flow structure
      const [nodesResult, edgesResult] = await Promise.all([
        supabaseClient
          .from('flow_nodes')
          .select('*')
          .eq('flow_id', flowId),
        supabaseClient
          .from('flow_edges')
          .select('*')
          .eq('flow_id', flowId)
      ])

      if (nodesResult.error) throw nodesResult.error
      if (edgesResult.error) throw edgesResult.error

      const nodes: FlowNode[] = nodesResult.data
      const edges: FlowEdge[] = edgesResult.data

      // Find start node
      const startNode = nodes.find(node => node.type === 'start')
      if (!startNode) {
        throw new Error('No start node found in flow')
      }

      // Update execution with current node
      await supabaseClient
        .from('flow_executions')
        .update({ current_node_id: startNode.node_id })
        .eq('id', execution.id)

      // Log execution start
      await supabaseClient
        .from('flow_execution_logs')
        .insert({
          execution_id: execution.id,
          node_id: startNode.node_id,
          action: 'start',
          input_data: initial_context,
          status: 'success'
        })

      // Execute first step
      await executeNode(supabaseClient, execution.id, startNode, nodes, edges, initial_context)

      return new Response(
        JSON.stringify({ 
          execution_id: execution.id,
          status: 'started',
          current_node: startNode.node_id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

async function executeNode(
  supabaseClient: any,
  executionId: string,
  node: FlowNode,
  nodes: FlowNode[],
  edges: FlowEdge[],
  context: any
) {
  const startTime = Date.now()
  
  try {
    let result: any = {}
    
    switch (node.type) {
      case 'start':
        result = { message: 'Flow started' }
        break
        
      case 'message':
        // Send WhatsApp message
        result = await sendWhatsAppMessage(node.data, context)
        break
        
      case 'condition':
        // Evaluate condition
        result = await evaluateCondition(node.data, context)
        break
        
      case 'action':
        // Execute action
        result = await executeAction(node.data, context)
        break
        
      case 'end':
        // End execution
        await supabaseClient
          .from('flow_executions')
          .update({ status: 'completed' })
          .eq('id', executionId)
        result = { message: 'Flow completed' }
        break
    }

    // Log successful execution
    await supabaseClient
      .from('flow_execution_logs')
      .insert({
        execution_id: executionId,
        node_id: node.node_id,
        action: `execute_${node.type}`,
        input_data: context,
        output_data: result,
        status: 'success',
        duration_ms: Date.now() - startTime
      })

    // Find next node(s)
    if (node.type !== 'end') {
      const nextEdges = edges.filter(edge => edge.source === node.node_id)
      
      for (const edge of nextEdges) {
        const nextNode = nodes.find(n => n.node_id === edge.target)
        if (nextNode) {
          // Update current node
          await supabaseClient
            .from('flow_executions')
            .update({ current_node_id: nextNode.node_id })
            .eq('id', executionId)
          
          // Execute next node
          await executeNode(supabaseClient, executionId, nextNode, nodes, edges, { ...context, ...result })
        }
      }
    }

  } catch (error) {
    // Log error
    await supabaseClient
      .from('flow_execution_logs')
      .insert({
        execution_id: executionId,
        node_id: node.node_id,
        action: `execute_${node.type}`,
        input_data: context,
        status: 'error',
        error_message: error.message,
        duration_ms: Date.now() - startTime
      })

    // Update execution status
    await supabaseClient
      .from('flow_executions')
      .update({ status: 'failed' })
      .eq('id', executionId)

    throw error
  }
}

async function sendWhatsAppMessage(nodeData: any, context: any) {
  // This would integrate with your WhatsApp API
  console.log('Sending WhatsApp message:', nodeData.message)
  return { message_sent: true, message: nodeData.message }
}

async function evaluateCondition(nodeData: any, context: any) {
  // This would evaluate the condition based on the node configuration
  console.log('Evaluating condition:', nodeData.conditions)
  return { condition_result: true }
}

async function executeAction(nodeData: any, context: any) {
  // This would execute the configured action
  console.log('Executing action:', nodeData.action)
  return { action_executed: true, action: nodeData.action }
}
