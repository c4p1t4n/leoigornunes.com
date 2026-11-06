export const site = {
  name: 'Leo Igor Nunes',
  tagline: 'Tecnologia, mercado financeiro e o que mais valer a pena escrever', // TODO: confirmar frase do masthead
  url: 'https://leoigornunes.com',
  author: {
    name: 'Leo Igor Nunes',
    bio: 'Engenheiro de software escrevendo sobre tecnologia, mercado financeiro e carreira.', // TODO: confirmar bio
    avatar: '/avatar.jpg',
  },
  social: {
    linkedin: 'https://www.linkedin.com/in/TODO',
    github: 'https://github.com/c4p1t4n',
  },
  featuredTags: [
    'tecnologia',
    'mercado-financeiro',
    'economia',
    'carreira',
    'opiniao',
  ],
  tagLabels: {
    aws: 'AWS',
    'mercado-financeiro': 'Mercado Financeiro',
    opiniao: 'Opinião',
  } as Record<string, string>,
  postsPerHome: 12,
};

/** Só redes com URL preenchida (ignora os TODO), para não gerar links quebrados. */
export const socialLinks = [
  { label: 'LinkedIn', href: site.social.linkedin },
  { label: 'GitHub', href: site.social.github },
].filter((l) => !l.href.includes('TODO'));
