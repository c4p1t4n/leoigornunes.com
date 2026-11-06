import { getImage } from 'astro:assets';
import { site, socialLinks } from '../config/site';
import type { Post } from './posts';

export type OgImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

const abs = (path: string) => new URL(path, site.url).href;

/** Imagem OG do artigo: capa recortada em 1200×630 (JPG). Sem capa, ou capa SVG (redes não leem SVG) → undefined = padrão do site. */
export async function ogImage(post: Post): Promise<OgImage | undefined> {
  const { cover, coverAlt } = post.data;
  if (!cover || cover.format === 'svg') return undefined;
  const img = await getImage({
    src: cover,
    width: 1200,
    height: 630,
    fit: 'cover',
    format: 'jpg',
  });
  return {
    url: img.src,
    alt: coverAlt ?? post.data.title,
    width: 1200,
    height: 630,
  };
}

const person = {
  '@type': 'Person',
  '@id': abs('/#autor'),
  name: site.author.name,
  url: abs('/'),
  ...(socialLinks.length && { sameAs: socialLinks.map((l) => l.href) }),
};

/** Home: WebSite + Person. */
export const homeJsonLd = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': abs('/#site'),
      url: abs('/'),
      name: site.name,
      description: site.tagline,
      inLanguage: 'pt-BR',
      publisher: { '@id': person['@id'] },
    },
    person,
  ],
});

/** Artigo: BlogPosting. */
export const postJsonLd = (post: Post, image?: OgImage) => {
  const { title, description, date, updated, tags } = post.data;
  const url = abs(`/artigos/${post.id}/`);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    datePublished: date.toISOString(),
    dateModified: (updated ?? date).toISOString(),
    inLanguage: 'pt-BR',
    keywords: tags.join(', '),
    image: [abs(image?.url ?? '/og-default.png')],
    author: { '@id': person['@id'] },
    publisher: { '@id': person['@id'] },
  };
};
