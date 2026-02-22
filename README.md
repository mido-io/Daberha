# دَبِّرها (Daberha)

**Daberha** is an Arabic-first, comprehensive personal finance and budget management application. Built to help users track expenses, manage budgets, and gain AI-powered insights into their financial habits with a clean, premium, and responsive user interface.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Database (ORM):** [Prisma](https://www.prisma.io/) + [Neon PostgreSQL](https://neon.tech)
- **Authentication:** [Clerk](https://clerk.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **AI Integration:** [Google Gemini API](https://ai.google.dev/)
- **Emails:** [Resend](https://resend.com/)

## Key Features

- **Dashboard:** Unified view of accounts, recent transactions, and overall budget pacing.
- **Transaction Management:** Add, edit, and categorize daily expenses and incomes.
- **Budget Tracking:** Set monthly budget limits, track daily pacing, and receive dynamic visual feedback.
- **Smart Receipt Scanner:** Use AI to automatically scan, extract, and categorize data from uploaded receipt images.
- **Financial Reports:** Interactive charts (Recharts) and on-demand AI financial insights.
- **Full Security:** Robust route protection and user management via Clerk.

## Local Development

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example` and fill in your keys (Database, Clerk, Gemini, Resend).

3. Setup the database schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment
The project is fully optimized for deployment on [Vercel](https://vercel.com/). Ensure all environment variables are properly configured in your Vercel project settings before deploying.

---
*Built with ❤️ for better financial clarity.*
