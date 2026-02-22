import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pzfwrcdyzbbkigueqhsy.supabase.co'
const supabaseAnonKey = 'sb_publishable_6Jlp_tNm-r4S2CSSJLl1rw_WZdfCBGX'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
