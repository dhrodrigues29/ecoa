import { supabase } from './supabase';
import type { TablesUpdate } from '../types/supabase';

export async function updatePoiPlanLevel(
  poiId: number,
  planLevel: number | null
): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('lugares')
    .update({ plan_level: planLevel } as TablesUpdate<'lugares'>)
    .eq('id', poiId);

  return error ? { error: error.message } : {};
}