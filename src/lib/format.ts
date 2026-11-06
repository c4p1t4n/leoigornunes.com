// Datas em pt-BR. Sempre UTC: `date: 2026-11-05` no frontmatter vira meia-noite UTC;
// em fuso local de Brasília apareceria como dia 4.
const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];
const pad = (n: number) => String(n).padStart(2, '0');

/** "05 nov" */
export const dateShort = (d: Date) =>
  `${pad(d.getUTCDate())} ${MESES[d.getUTCMonth()].slice(0, 3)}`;
/** "5 de novembro de 2026" */
export const dateLong = (d: Date) =>
  `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
/** "Novembro 2026" */
export const monthLabel = (year: number, month: number) =>
  `${MESES[month][0].toUpperCase()}${MESES[month].slice(1)} ${year}`;
/** "2026-11-05" para <time datetime> */
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
/** "1 artigo" / "4 artigos" */
export const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;
