# stefan-site

Personal site and blog of Stefan Ilić, built with [Astro](https://astro.build) and hosted on GitHub Pages.

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
```

## Edit content

- Career islands: `src/data/journey.json`
- Blog posts: add a Markdown file to `src/content/blog/` (set `draft: false` to publish)
- Projects: `src/pages/projects.astro`
- CV: replace `public/Stefan_Ilic_CV.pdf`

## Publish (one-time setup)

1. Create a public GitHub repo named `Ilke415.github.io`.
2. In `astro.config.mjs`, the site URL is already set to https://Ilke415.github.io.
3. Push this folder to the `master` branch.
4. On GitHub: Settings → Pages → Build and deployment → Source: **GitHub Actions**.

Every push to `master` then builds and deploys the site automatically.
