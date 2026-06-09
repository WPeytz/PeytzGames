// The single place to add games. Each entry shows up on the home page grid.
//
// - `embed: true`  → the game gets a /play/<slug> page that iframes `url`
//   (the game must allow being embedded, i.e. no X-Frame-Options/CSP block).
// - `embed: false` → the card links straight out to `url`.
// - `thumbnail` is optional: drop an image in /public/thumbs (e.g.
//   /public/thumbs/blocks.png) and set thumbnail: '/thumbs/blocks.png'.
//   Without one, a styled placeholder with the title is shown.

export type Game = {
  slug: string;
  title: string;
  tagline: string;
  url: string;
  embed: boolean;
  year: number;
  status: 'live' | 'beta' | 'coming soon';
  controls?: string;
  thumbnail?: string;
};

export const GAMES: Game[] = [
  {
    slug: 'blocks',
    title: 'Blocks',
    tagline: 'An original falling-block puzzle. How long can you survive?',
    url: 'https://blocks.williampeytz.com',
    embed: true,
    year: 2026,
    status: 'live',
    controls: 'Click the board, then use the arrow keys.',
  },
  {
    slug: 'liferunner',
    title: 'LifeRunner.io',
    tagline:
      'A life simulation where time, energy, and money are limited — feel the tradeoffs.',
    url: 'https://www.liferunner.io',
    embed: true,
    year: 2026,
    status: 'live',
  },
  {
    slug: 'lastnamelegacy',
    title: 'LastNameLegacy',
    tagline:
      'I show you a famous surname, you guess the first name. Scored by AI.',
    url: 'https://lastnamelegacy.com',
    embed: false,
    year: 2026,
    status: 'live',
  },
  {
    slug: 'peytzpvp',
    title: 'PeytzPvP',
    tagline:
      'Hardcore Games-style PvP for Minecraft Paper servers. Arenas, kits, one winner.',
    url: 'https://peytzpvp.com',
    embed: false,
    year: 2026,
    status: 'live',
  },
];
