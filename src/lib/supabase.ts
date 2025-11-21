// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env';

// ------------------------------------------------------------------
// 3-a  If you generated types (see step 4) import them:
// import type { Database } from '../types/supabase';
// export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
// ------------------------------------------------------------------

// For now we use “any” so build passes; swap line above later.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);