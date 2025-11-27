// src/lib/search.ts
import { supabase } from './supabase';

export async function searchTitles(q: string, limit = 4) {
  if (!q) return [];

  /* 1. starts-with (case-insensitive) */
  const { data: start } = await supabase
    .from('lugares')
    .select('id,titulo')
    .ilike('titulo', `${q}%`)
    .limit(limit);

  /* 2. general contains – skip the ones we already have */
  const { data: rest } = await supabase
    .from('lugares')
    .select('id,titulo')
    .ilike('titulo', `%${q}%`)
    .not('titulo', 'ilike', `${q}%`)   // de-duplicate
    .limit(limit - (start?.length ?? 0));

  return [
    ...(start ?? []),
    ...(rest ?? [])
  ].slice(0, limit);
}

export async function searchTags(q: string, limit = 6) {
  if (!q) return [];
  const { data } = await supabase
    .rpc('search_tags_rpc', { q, lim: limit });
  return (data ?? []).map((r: { tag: string }) => r.tag);
}