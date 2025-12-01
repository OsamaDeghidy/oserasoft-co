import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Environment flag to control database usage
const USE_DATABASE = process.env.NODE_ENV === 'production' || process.env.USE_DATABASE === 'true'

if (!supabaseUrl || !supabaseAnonKey) {
  if (USE_DATABASE) {
    console.warn('Supabase environment variables are not set')
  }
}

// Client-side Supabase client (for browser)
export const supabase = (USE_DATABASE && supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null

// Server-side Supabase client with Service Role Key (bypasses RLS)
export const createServerClient = () => {
  if (!USE_DATABASE) {
    return null
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('Supabase environment variables are not set')
    return null
  }
  
  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

