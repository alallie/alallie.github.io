# Launchpad

A dependency-free personal start page designed for GitHub Pages. It runs entirely in the browser, so search preferences, themes, and custom search engines stay on the device through local storage.

## Run locally

From the repository root, use any static file server. For example:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Features

- Kagi is the default search engine.
- Google, DuckDuckGo, Brave, Bing, and Startpage are included.
- Custom search engines use a URL template containing `{query}`.
- Favorite links are defined in `favorites` in `app.js`.
- Themes are defined through CSS variables in `style.css` and registered in `renderThemeOptions`.
- Utilities are built by `renderUtilities`; add another utility card there using the existing utility-card pattern.
- Utilities live on the dedicated `/utils/` page so the start page stays focused on search and links.
- Quotes try the public DummyJSON quote endpoint first and use a bundled collection when the request fails or the page is offline.

## GitHub Pages

Push the repository to GitHub and enable Pages from the repository's branch and root directory. No build command or server-side configuration is required.

## Browser storage

The app uses these namespaced keys:

- `launchpad.theme`
- `launchpad.engine`
- `launchpad.custom-engines`

Clearing site data resets the page to Kagi and the light theme.
