# PeytzGames

The site behind [peytzgames.com](https://peytzgames.com) — a collection of
games by William Peytz. Built with Astro and Tailwind.

## Adding a game

Edit `src/data/games.ts` and add an entry to the `GAMES` array:

- `embed: true` gives the game its own `/play/<slug>` page that embeds the
  game in an iframe (the game's host must allow framing).
- `embed: false` makes the card link directly to the game's URL.
- Optional `thumbnail`: drop an image in `public/thumbs/` and reference it
  as `/thumbs/<name>.png`. Without one, a styled placeholder is shown.
- `status` can be `live`, `beta`, or `coming soon` (coming-soon cards are
  shown but not clickable).

## Commands

```sh
npm install
npm run dev      # dev server at localhost:4321
npm run build    # production build to dist/
npm run preview  # preview the build
```

## Deploying

Static output — push to GitHub, import on [Vercel](https://vercel.com), and
point peytzgames.com at the project. No extra config needed.
