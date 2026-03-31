# VibeCheck

**Stack:** Vanilla HTML/CSS/JS, Google Maps API  
**Live:** https://projects.slash301.com/VibeCheck/  
**Local:** Open `index.html` directly (Maps API key required for full functionality)

## What it is
Google Maps-based vibe rating tool — drop a pin on any location, rate the vibe, browse vibe reports, plan events and share vibe checks. Mobile-first MVP targeting social/going-out use cases.

## Structure
- `index.html` — main map + vibe check UI
- `add-vibe.html` — vibe submission page
- `pages/` — additional views
- `script.js` — all app logic
- `styles.css` — mobile-first CSS with CSS custom properties
- `vibecheck.md` — architecture doc (comprehensive: schema, data model, PWA notes)
- `_backup-260304/` — snapshot from March 2026

## State
Backup from March 2026 means recent active work. Architecture doc describes planned PostgreSQL (Neon) + Drizzle ORM backend — may not be implemented yet (current version likely uses localStorage or no persistence). Single-page static app for now.

## What needs work / next directions
- Backend implementation: Neon PostgreSQL + Drizzle ORM (planned per vibecheck.md)
- User auth and persistent vibe storage
- Plans/events feature (paid tier concept in the arch doc)
- Maps API key management for production
