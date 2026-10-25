# WISS-OS — Wissal Naouaii's portfolio

Plain HTML, CSS and JavaScript. No build step, no install.

```
site/
├── index.html        ← all the content lives here
├── css/style.css     ← design (colors, layout, the OS "dials")
├── js/main.js        ← boot screen, scroll effects, certificate carousel, contact form
└── assets/
    ├── cv_WissalNaouaii.pdf
    └── img/          ← all photos and logos
```

## Preview it
Double-click `index.html`. When opened from your computer, every spot still waiting for your details
gets an **orange dashed outline**. Search `TODO` in `index.html` to find them all.
(The outlines never show on the published site.)

## Common edits
- **Change text**: edit it directly in `index.html`. Each section is marked with a big comment, e.g. `<!-- ===== 03 PROJECTS ===== -->`.
- **Swap an image**: put the file in `assets/img/` and change the `src="assets/img/…"` path.
  Replace a placeholder box `<div class="ph">TODO…</div>` with
  `<div class="media r169"><img src="assets/img/your-photo.jpg" alt="describe it"></div>`
  (`r169` = 16:10 frame, `r43` = 4:3, add `logo` for logos on a light background).
- **Add a project**: copy one whole `<!-- PROJECT n -->` block and edit it.
- **Add a certificate**: copy one `<div class="slide">…</div>` inside the Certificate Viewer. Dots and counter update automatically.
  To show the real scan, replace its `<div class="page">…</div>` with `<div class="page img"><img src="assets/img/cert.jpg" alt="…"></div>`.
- **Colors**: top of `css/style.css` (`--accent` is your blue, rgb 51 81 230).

## Contact form
Until it's connected, the form opens the visitor's email app. To receive messages directly:
1. Go to web3forms.com, enter `wissalnaouaii@gmail.com`, and copy the access key they email you.
2. Paste it in `index.html` → `<input type="hidden" name="access_key" value="PASTE-HERE">`.

## Publish on GitHub Pages (free)
1. Create a repo named **`WissalNaouaii.github.io`** on GitHub.
2. Upload the contents of this `site` folder (index.html at the top level).
3. Repo → Settings → Pages → Source: *Deploy from a branch* → `main` / root.
4. Your site goes live at **https://wissalnaouaii.github.io** within a minute or two.

## Boot screen
Plays on the first visit of each browser session. Click **◆ WISS-OS** in the taskbar to replay it.
Visitors can skip it with any key, click, or scroll.
