import { site } from '../config/site';

/** "Mercado Financeiro" → "mercado-financeiro" (minúsculas, sem acento, kebab-case). */
export const normalizeTag = (tag: string) =>
  tag
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Rótulo de exibição: mapa em site.tagLabels, fallback title case. */
export const tagLabel = (tag: string) =>
  site.tagLabels[tag] ??
  tag
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
