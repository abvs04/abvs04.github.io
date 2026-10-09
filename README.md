# XR Portfolio

A static portfolio site. There's no build step, no framework and nothing to install.

## Preview it locally

Double-clicking `index.html` works. For the most accurate preview, use a local server:

```
cd xr-portfolio
npx serve .          # or: python -m http.server 8000
```

Then open the address it prints.

## Edit your content

Everything lives in **`js/data.js`**:

- `PROFILE`: your name, email, LinkedIn, resume link and headline. **Replace the placeholders before you publish.**
- `PROJECTS`: one block per project. Any entry with `sample: true` contains placeholder copy, including team sizes, durations and outcomes. Rewrite these with the real story.
  - **Keltron XR Programme** still has only sample copy and no footage. The team size and duration for ArcelorMittal are still blank (—). UNFPA Fiji is a separate project to add later.
- `featured: true` puts a project first in its row.

## Lab (personal work)

The Lab entries live in `LAB` at the bottom of `js/data.js`. Add an image for each one at `media/lab/<slug>.jpg`. The exact filenames are listed in `media/lab/PUT-IMAGES-HERE.txt`. A card with no image shows as text only.

## Add or replace media

Each project has a folder at `media/<slug>/`:

| file | used for |
|---|---|
| `poster.jpg` | tile image + hero channel thumbnail |
| `loop.mp4` | 7-second silent loop: tile hover + hero feed |
| `reel-1.mp4`, `reel-2.mp4` | full videos in the case file |
| `still-*.jpg`, `deck-*.jpg` | gallery thumbnails in the case file |

Reels and stills are listed in `js/media.js`. When you add a file, add it there too.

To make a loop from any video (requires ffmpeg):

```
ffmpeg -ss 10 -t 7 -i input.mp4 -an -vf "scale='min(720,iw)':-2,fps=30" -c:v libx264 -crf 30 -pix_fmt yuv420p -movflags +faststart loop.mp4
```

## Deploy

Drag the folder onto **Netlify Drop** (app.netlify.com/drop), or push it to GitHub and import it in **Vercel** or **GitHub Pages**. Every file is under 100 MB, so all three work.

## Portrait, resume and background

- **Portrait:** `media/portrait.jpg` is a temporary crop from your mockup. Replace it with a sharp square photo, about 600×600, using the same filename.
- **Resume:** save your PDF as `resume.pdf` next to `index.html`. The Resume link in the menu points there.
- **Background:** the floating shapes are drawn live in `js/scene.js` with Three.js, which is saved in `assets/vendor`. If a device can't run WebGL, a CSS apricot gradient shows instead.
- **Story showcase:** the five projects told as chapters on scroll are set in `PROFILE.showcase`. Each chapter's words live in `CHAPTERS` at the bottom of `js/data.js`: the big background word (`kicker`), glow colour (`tint`), the three beats (`problem`, `did`, `result`), up to three numbers (`stats`, numbers count up) and up to three floating stills (`sats`, files in that project's media folder). **Stats marked `// SAMPLE` are placeholders — replace them with real figures.** The animation lives in `js/showcase.js`. With reduced motion turned on, chapters show as a simple list.
- **All work:** projects are grouped into rows by `category`, using the labels and one-line intros in `CATEGORIES`. Visitors can switch to the Index view for a scannable list.

## Design system

The Ember Glass design system page is at `design-system.html`, and all tokens are in `css/tokens.css`. Components only reference tokens. To re-theme the site, change the tokens and nothing else.
