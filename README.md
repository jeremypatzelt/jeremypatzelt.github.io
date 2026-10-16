# Jeremy Patzelt: personal site

Static HTML, CSS, and JS. No build step.

## Publish on GitHub Pages

1. Create a GitHub repo. For a clean URL, name it `<your-username>.github.io`.
2. Upload everything in this folder (`index.html`, `css/`, `js/`, `.nojekyll`) to the repo root.
3. In the repo, go to Settings, then Pages. Set Source to "Deploy from a branch", choose `main` and `/ (root)`, and save.
4. Your site goes live at `https://<your-username>.github.io/` within a minute or two.

Using the jeremypatzelt.com domain: add it under Settings, then Pages, then Custom domain, and point your DNS at GitHub.

## Edit

- Email button: set `EMAIL` at the top of `js/main.js` (hidden while empty).
- Content: edit `index.html`. Colors: `:root` in `css/style.css`.
- Photo: currently loads from jeremypatzelt.com. For reliability, save it as `img/jeremy.jpg` and update the `src` in `index.html`.
