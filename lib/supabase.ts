import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Mudamos de createClient para createBrowserClient
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)