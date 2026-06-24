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
  /** Hide from the home grid and skip its /play page (config is kept). */
  hidden?: boolean;
  /** Show an online leaderboard on the play page (the game must report
   * scores to the host page via postMessage). */
  leaderboard?: boolean;
};

export const GAMES: Game[] = [
  {
    slug: 'gravityflipper',
    title: 'GravityFlipper',
    tagline:
      "A precision puzzle-platformer where you can't jump — you flip gravity. Reach the portal across 10 single-screen levels.",
    url: 'https://peytzgames.com/games/gravityflipper/',
    embed: true,
    year: 2026,
    status: 'live',
    controls: 'A/D or ←/→ to move · Space to flip gravity · R to restart.',
    thumbnail: '/thumbs/gravityflipper.svg',
  },
  {
    slug: 'blocks',
    title: 'Blocks',
    tagline: 'An original falling-block puzzle. How long can you survive?',
    url: 'https://peytzgames.com/games/blocks/',
    embed: true,
    year: 2026,
    status: 'live',
    controls: 'Click the board, then use the arrow keys.',
    leaderboard: true,
    thumbnail: '/thumbs/blocks.svg',
  },
  {
    slug: 'liferunner',
    title: 'LifeRunner',
    tagline:
      'A life simulation where time, energy, and money are limited — feel the tradeoffs.',
    url: 'https://www.liferunner.io',
    embed: true,
    year: 2026,
    status: 'live',
    thumbnail: '/thumbs/liferunner.svg',
  },
  {
    slug: 'lastnamelegacy',
    title: 'LastNameLegacy',
    tagline:
      'I show you a famous surname, you guess the first name. Scored by AI.',
    url: 'https://lastnamelegacy.com',
    embed: true,
    year: 2026,
    status: 'live',
  },
  {
    slug: 'eloquiz',
    title: 'EloQuiz',
    tagline:
      'Adaptive math practice with an Elo-rating system — always playing at the edge of your ability.',
    url: 'https://eloquiz.dk',
    embed: true,
    year: 2025,
    status: 'live',
    hidden: true,
  },
  {
    slug: 'peytzpvp',
    title: 'PeytzPvP',
    tagline:
      'Hardcore Games-style PvP for Minecraft Paper servers. Arenas, kits, one winner.',
    url: 'https://www.peytzpvp.com',
    embed: true,
    year: 2026,
    status: 'live',
  },
  {
    slug: 'buildthefuture',
    title: 'BuildTheFuture',
    tagline:
      'A trivia journey through the ages — answer your way from Ancient Egypt to the AI era.',
    url: 'https://peytzgames.com/games/buildthefuture/',
    embed: true,
    year: 2024,
    status: 'live',
    controls: 'Type your answer, then press Check Answer.',
    thumbnail: '/thumbs/buildthefuture.svg',
  },
  {
    slug: 'liftoffjump',
    title: 'LiftoffJump',
    tagline:
      'A Doodle Jump-style climb — auto-bounce an astronaut from city rooftops all the way to the Moon.',
    url: 'https://peytzgames.com/games/liftoffjump/',
    embed: true,
    year: 2026,
    status: 'live',
    controls: 'A/D or ←/→ to move · Space/Enter to start or restart.',
    thumbnail: '/thumbs/liftoffjump.svg',
    leaderboard: true,
  },
];
