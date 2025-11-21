// src/lib/search.ts
import { supabase } from './supabase';

export async function searchTitles(q: string, limit = 4) {
  if (!q) return [];
  const { data } = await supabase
    .from('lugares')
    .select('id,titulo')
    .ilike('titulo', `%${q}%`)
    .limit(limit);
  return data ?? [];
}

export async function searchTags(q: string, limit = 6) {
  if (!q) return [];
  const { data } = await supabase
    .rpc('search_tags_rpc', { q, lim: limit });
  return (data ?? []).map((r: { tag: string }) => r.tag);
}