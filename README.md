# Autobiography Data Builder

Autobiography Data Builder is a full-stack Next.js application that guides people through collecting life stories, organizing memories, and transforming their experiences into a polished autobiography. The platform combines step-by-step data capture, timeline visualization, AI-assisted writing, export tooling, and administrative insights.

## Features

- **Authentication** — Email/password and Google OAuth using NextAuth.
- **Guided Story Capture** — Multi-step forms covering personal information, childhood, education, career, family, challenges, and future goals.
- **Creative Prompts** — Curated guidance to help users recall and document meaningful details.
- **Life Timeline** — Add milestones with images, notes, and dates to visualize each chapter.
- **AI Story Generator** — Gemini-powered drafting with multiple writing styles (emotional, professional, simple, poetic).
- **In-Place Editing** — Refine AI output directly in the dashboard.
- **Customization Tools** — Choose cover image, typography, subtitles, and quotes.
- **Exports** — Generate PDF and DOCX autobiographies on demand.
- **Shareable Pages** — Publish a public link for friends and family.
- **Admin Dashboard** — Monitor user activity and publication status.

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- [NextAuth.js](https://next-auth.js.org/) with credentials & Google providers
- [MongoDB](https://www.mongodb.com/) for persistence
- [Gemini API](https://ai.google.dev/) via `@google/generative-ai`
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [PDFKit](https://pdfkit.org/) and [`docx`](https://www.npmjs.com/package/docx) for exports
- Client libraries: `react-hook-form`, `zod`, `zustand`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local` based on `.env.example`:

```
MONGODB_URI=mongodb+srv://...
MONGODB_DB=autobiography-data-builder
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-1.5-pro
```

### 3. Run development server

```bash
npm run dev
```

Visit `http://localhost:3000` to explore the app.

## Admin Access

Set any user's `role` field to `admin` in MongoDB to unlock the admin dashboard at `/admin`.

## Deployment

The project is optimized for [Vercel](https://vercel.com/). Ensure the environment variables above are defined in the Vercel project before deploying.

## License

MIT © 2024 Autobiography Data Builder.
