
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
    const flowId = pathParts[pathParts.length - 1]

    // GET /flows - List all flows
    if (req.method === 'GET' && pathParts.length === 3) {
      const { data, error } = await supabaseClient
        .from('flows')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /flows/:id - Get specific flow
    if (req.method === 'GET' && pathParts.length === 4) {
      const { data, error } = await supabaseClient
        .from('flows')
        .select('*')
        .eq('id', flowId)
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /flows - Create new flow
    if (req.method === 'POST' && pathParts.length === 3) {
      const body = await req.json()
      
      const { data: user } = await supabaseClient.auth.getUser()
      if (!user.user) throw new Error('User not authenticated')

      const { data, error } = await supabaseClient
        .from('flows')
        .insert({
          ...body,
          created_by: user.user.id
        })
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // PUT /flows/:id - Update flow
    if (req.method === 'PUT' && pathParts.length === 4) {
      const body = await req.json()
      
      const { data, error } = await supabaseClient
        .from('flows')
        .update(body)
        .eq('id', flowId)
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // DELETE /flows/:id - Delete flow
    if (req.method === 'DELETE' && pathParts.length === 4) {
      const { error } = await supabaseClient
        .from('flows')
        .delete()
        .eq('id', flowId)

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Route not found' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404
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
