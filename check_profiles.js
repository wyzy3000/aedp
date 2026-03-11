import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: 'C:/Users/wycli/OneDrive/Desktop/Antigravity/ACP portal gemini/.env.local' })
dotenv.config({ path: 'C:/Users/wycli/OneDrive/Desktop/Antigravity/ACP portal gemini/.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkProfiles() {
  const { data, error } = await supabase.from('profiles').select('*').limit(5)
  console.log('Data:', JSON.stringify(data, null, 2))
  console.log('Error:', error)
}

checkProfiles()
