import { describe, it, expect, vi } from 'vitest';
import { supabase } from '../supabase';
import { searchTitles, searchTags } from '../search';
import type { PostgrestSingleResponse } from '@supabase/supabase-js'

/* ---------- searchTitles ---------- */
describe('searchTitles', () => {
  it('returns empty array for empty query', async () => {
    expect(await searchTitles('')).toEqual([]);
  });

  it('calls lugares with ilike and limit', async () => {
    const fakeData = [{ id: 1, titulo: 'Bar do Zé' }];
    const limitMock  = vi.fn().mockResolvedValueOnce({ data: fakeData });
    const ilikeMock  = vi.fn().mockReturnValueOnce({ limit: limitMock });
    const selectMock = vi.fn().mockReturnValueOnce({ ilike: ilikeMock });
    const fromMock   = vi.fn().mockReturnValueOnce({ select: selectMock });

    // @ts-ignore
    supabase.from = fromMock;

    const res = await searchTitles('bar', 4);

    expect(fromMock).toHaveBeenCalledWith('lugares');
    expect(selectMock).toHaveBeenCalledWith('id,titulo');
    expect(ilikeMock).toHaveBeenCalledWith('titulo', '%bar%');
    expect(limitMock).toHaveBeenCalledWith(4);
    expect(res).toEqual(fakeData);
  });
});

/* ---------- searchTags ---------- */
describe('searchTags', () => {
  it('returns empty array for empty query', async () => {
    expect(await searchTags('')).toEqual([]);
  });

  it('calls search_tags_rpc with correct params', async () => {
  const fakeRows = [{ tag: 'samba' }, { tag: 'sertanejo' }];
  const fakeResp: PostgrestSingleResponse<{ tag: string }[]> = {
    data: fakeRows,
    error: null,
    count: null,
    status: 200,
    statusText: 'OK',
  };

  vi.spyOn(supabase, 'rpc').mockResolvedValueOnce(fakeResp);

  const res = await searchTags('sa', 6);

  expect(supabase.rpc).toHaveBeenCalledWith('search_tags_rpc', { q: 'sa', lim: 6 });
  expect(res).toEqual(['samba', 'sertanejo']);
});
});