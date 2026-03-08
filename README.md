# 🦘 What's On Sydney — Live Events Finder

A beautiful, minimal Next.js website that automatically scrapes and displays events happening in Sydney, Australia.

## Features

- 🔍 **Auto-scraping** from Eventbrite, What's On Sydney (City of Sydney), and Ticketek
- 🎨 **Stunning dark UI** with animated hero, smooth card interactions, and responsive grid
- 🏷️ **Category filtering** — Music, Festival, Market, Sport, Arts, Food, Film, Comedy & more
- 🔎 **Live search** with debounce across title, description, and location
- 🔄 **Auto-refresh** every 30 minutes with manual refresh button
- 📱 **Fully responsive** on mobile and desktop

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Cheerio** for HTML scraping
- **DM Sans + Fraunces** fonts
- Pure CSS animations (no extra animation libraries needed)

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## How Scraping Works

The scraper in `src/lib/scraper.js` fetches from three public sources:

| Source | URL | Method |
|---|---|---|
| Eventbrite | eventbrite.com.au/d/australia--sydney/events | HTML scraping via Cheerio |
| What's On Sydney | cityofsydney.nsw.gov.au API | JSON API |
| Ticketek | premier.ticketek.com.au | HTML scraping via Cheerio |

**Fallback**: If all scrapers fail (e.g., sites block the request), the app falls back to 12 rich mock Sydney events so the UI always looks great.

## Adding Real API Keys (Recommended)

For more reliable and richer data, add API keys to `.env.local`:

### Ticketmaster (Free Tier — 5,000 calls/day)
1. Sign up at https://developer.ticketmaster.com
2. Add `TICKETMASTER_API_KEY=your_key` to `.env.local`
3. Uncomment the Ticketmaster integration in `src/lib/scraper.js`

### Eventbrite Private Token
1. Go to https://www.eventbrite.com/platform/api
2. Add `EVENTBRITE_TOKEN=your_token` to `.env.local`
3. Uncomment the Eventbrite API integration

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── events/
│   │       └── route.js       # API endpoint with caching
│   ├── components/
│   │   └── EventCard.jsx      # Event card component
│   ├── globals.css            # All styling
│   ├── layout.jsx             # Root layout + fonts
│   └── page.jsx               # Main page
└── lib/
    └── scraper.js             # Multi-source scraper
```

## Deployment

Deploy easily to Vercel:

```bash
npm install -g vercel
vercel
```

The site automatically revalidates scraped data every 30 minutes via Next.js ISR.
