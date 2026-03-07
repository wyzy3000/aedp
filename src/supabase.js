import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

let client = null

try {
    if (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseUrl.startsWith('http')) {
        client = createClient(supabaseUrl, supabaseAnonKey)
    } else {
        console.warn('Supabase URL is not set or valid in .env.local. App will run in UI-only mode.')
    }
} catch (error) {
    console.error('Supabase initialization warning:', error.message)
}

export const supabase = client
