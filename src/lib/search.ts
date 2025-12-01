// src/lib/search.ts
import { supabase } from './supabase';

export const planCache = new Map<number, number>(); 


export async function searchTitles(q: string, limit = 4) {
  if (!q) return [];

  const { data: start } = await supabase
    .from('lugares')
    .select('id,titulo,plan_id')
    .ilike('titulo', `${q}%`)
    .limit(limit);

  const { data: rest } = await supabase
    .from('lugares')
    .select('id,titulo,plan_id')
    .ilike('titulo', `%${q}%`)
    .not('titulo', 'ilike', `${q}%`)
    .limit(limit - (start?.length ?? 0));

  const merged = [
    ...(start ?? []),
    ...(rest ?? [])
  ].slice(0, limit);

  /* merge cached plan (if any) – still read-only */
  return merged.map(r => ({
    ...r,
    plan_id: planCache.get(r.id) ?? r.plan_id
  }));
}

export async function searchTags(q: string, limit = 6) {
  if (!q) return [];
  const { data } = await supabase
    .rpc('search_tags_rpc', { q, lim: limit });
  return (data ?? []).map((r: { tag: string }) => r.tag);
}