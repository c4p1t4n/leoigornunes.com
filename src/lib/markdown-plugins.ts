// Plugins hast do Sätteri (processador Markdown padrão do Astro 7).
import Slugger from 'github-slugger';

type Node = { tagName?: string; properties?: Record<string, unknown> };
type Ctx = {
  textContent(n: Node): string;
  setProperty(n: Node, k: string, v: unknown): void;
  appendChild(n: Node, c: unknown): void;
};

/** h2/h3 ganham id (mesmo slugger do Astro) e um link de âncora no fim, visível no hover. */
export const autolinkHeadings = () => {
  const slugger = new Slugger();
  return {
    name: 'autolink-headings',
    element: {
      filter: ['h2', 'h3'],
      visit(node: Node, ctx: Ctx) {
        const id = slugger.slug(ctx.textContent(node).trim()); // trim: ícone antes do texto deixa espaço inicial
        ctx.setProperty(node, 'id', id); // o plugin nativo reaproveita um id já existente
        ctx.appendChild(node, {
          type: 'element',
          tagName: 'a',
          properties: {
            href: `#${id}`,
            className: ['anchor'],
            ariaLabel: 'Link para esta seção',
          },
          children: [], // o '#' vem de CSS (.anchor::after), para não entrar no texto do título/TOC
        });
      },
    },
  };
};

/** Links externos abrem em nova aba com rel seguro. */
export const externalLinks = {
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node: Node, ctx: Ctx) {
      const href = node.properties?.href;
      if (
        typeof href === 'string' &&
        /^https?:\/\//.test(href) &&
        !href.startsWith('https://leoigornunes.com')
      ) {
        ctx.setProperty(node, 'target', '_blank');
        ctx.setProperty(node, 'rel', 'noopener noreferrer');
      }
    },
  },
};
