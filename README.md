# Nova Market — E-Commerce Store

A responsive front-end storefront built with HTML, CSS and vanilla JavaScript. This is a portfolio/demo project; checkout does not process real payments or submit orders to a server.

## Features

- Product cards rendered from a single JavaScript product array
- Live product search, category filtering and sorting
- Add-to-cart, quantity controls, item removal and automatic totals
- Cart persistence with `localStorage`
- Responsive cart drawer and checkout modal
- Basic checkout form validation and demo order confirmation
- Responsive layout, semantic HTML and keyboard-friendly controls

## Tech stack

- HTML5
- CSS3 (Grid, Flexbox, media queries)
- Vanilla JavaScript (DOM, events, array methods, `localStorage`)

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a browser, or use the VS Code Live Server extension.
3. Internet access is needed for the Google Fonts and remote Unsplash product images.

No build step or package installation is required.

## Deploy with GitHub Pages

1. Push the project files to a GitHub repository.
2. Open **Settings → Pages**.
3. Under the build/deployment section, choose **Deploy from a branch**.
4. Choose your default branch and `/ (root)`, then save.
5. Wait for GitHub Pages to publish the site and add the demo URL to this README.

## Suggested future improvements

- Load products from a real API or backend
- Add product detail pages and pagination
- Add automated tests
- Add a backend, database, authentication and secure payment provider for a production store

## Important

The checkout is a front-end demo only. It does not create a real order, send personal details to a server, or collect payments.
