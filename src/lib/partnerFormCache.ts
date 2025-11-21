const KEY = '__partner_form_cache';
const VERSION = 1;                       // bump to invalidate old caches

export function getPartnerForm<T>(): T | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const { v, data } = JSON.parse(raw);
    return v === VERSION ? data : undefined;
  } catch {
    return undefined;
  }
}

export function setPartnerForm<T>(data: T) {
  localStorage.setItem(KEY, JSON.stringify({ v: VERSION, data }));
}

export function clearPartnerForm() {
  localStorage.removeItem(KEY);
}