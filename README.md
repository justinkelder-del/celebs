# Portfolio Voting Site

A simple portfolio gallery website you can upload directly to GitHub and publish with GitHub Pages.

## What this version does
- Shows 3 separate portfolios
- Lets visitors open each gallery
- Lets visitors vote for their favorite
- Looks polished on desktop and mobile
- Works as a static website with no build step

## Important limitation
Because GitHub Pages is static hosting, this version stores votes in the visitor's browser with `localStorage`.

That means:
- each visitor can still vote
- each visitor sees their own vote reflected on their device
- but votes are **not shared globally across all visitors**

For one combined vote total across all visitors, you would need a backend such as:
- Supabase
- Firebase
- Airtable
- a simple form/database service

## Files
- `index.html` — page structure
- `styles.css` — styling
- `script.js` — gallery data and vote logic

## How to customize the images
Open `script.js` and edit the `galleries` array.

Each portfolio has:
- `name`
- `description`
- `cover`
- `images`

You can replace the sample image URLs with:
1. your own hosted image URLs, or
2. image files stored inside your repo, such as:
   - `images/portfolio-a/photo-1.jpg`
   - `images/portfolio-b/photo-1.jpg`

Example:
```js
cover: "images/portfolio-a/cover.jpg"
```

## Upload to GitHub
1. Create a new GitHub repository
2. Upload all files from this folder into the root of the repo
3. Commit changes

## Turn on GitHub Pages
1. Open the repo on GitHub
2. Go to **Settings**
3. Click **Pages**
4. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Save

After a minute or two, GitHub will give you a live site URL.

## Suggested next step
If you want, the next version can be upgraded to:
- collect real shared votes
- limit one vote per email
- hide results until voting closes
- include your actual portfolios and branding
