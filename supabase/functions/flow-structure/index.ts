
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const flowId = pathParts[pathParts.length - 2] // flows/:id/structure

    // GET /flows/:id/structure - Get flow structure
    if (req.method === 'GET') {
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

      return new Response(
        JSON.stringify({
          nodes: nodesResult.data,
          edges: edgesResult.data
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /flows/:id/structure - Save flow structure
    if (req.method === 'POST') {
      const { nodes, edges } = await req.json()

      // Start transaction by deleting existing nodes and edges
      const { error: deleteNodesError } = await supabaseClient
        .from('flow_nodes')
        .delete()
        .eq('flow_id', flowId)

      if (deleteNodesError) throw deleteNodesError

      const { error: deleteEdgesError } = await supabaseClient
        .from('flow_edges')
        .delete()
        .eq('flow_id', flowId)

      if (deleteEdgesError) throw deleteEdgesError

      // Insert new nodes
      if (nodes && nodes.length > 0) {
        const { error: insertNodesError } = await supabaseClient
          .from('flow_nodes')
          .insert(
            nodes.map((node: any) => ({
              flow_id: flowId,
              node_id: node.id,
              type: node.type,
              position: node.position,
              data: node.data
            }))
          )

        if (insertNodesError) throw insertNodesError
      }

      // Insert new edges
      if (edges && edges.length > 0) {
        const { error: insertEdgesError } = await supabaseClient
          .from('flow_edges')
          .insert(
            edges.map((edge: any) => ({
              flow_id: flowId,
              edge_id: edge.id,
              source: edge.source,
              target: edge.target,
              source_handle: edge.sourceHandle,
              target_handle: edge.targetHandle,
              data: edge.data || {}
            }))
          )

        if (insertEdgesError) throw insertEdgesError
      }

      return new Response(
        JSON.stringify({ success: true }),
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
