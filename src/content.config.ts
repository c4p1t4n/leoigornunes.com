import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { normalizeTag } from './lib/tags';

const artigos = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/artigos',
    // slug = frontmatter `slug`, senão nome do arquivo/pasta (pasta/index.md → pasta)
    generateId: ({ entry, data }) =>
      (data.slug as string | undefined) ?? entry.replace(/(\/index)?\.md$/, ''),
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        description: z.string().min(1).max(300),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        tags: z
          .array(z.string())
          .min(1)
          .transform((tags) => tags.map(normalizeTag)),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        slug: z.string().optional(),
      })
      .refine((d) => !d.cover || !!d.coverAlt, {
        message: 'coverAlt é obrigatório quando há cover',
      }),
});

const paginas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/paginas' }),
  schema: z.object({ title: z.string(), description: z.string().optional() }),
});

export const collections = { artigos, paginas };
