# Dealping - AI-Powered Contract Management for Freelancers

Never miss a renewal, rate increase, or payment term again. Dealping is an AI-powered contract reminder system designed specifically for freelancers to track client contracts with automated reminders.

## Features

- 🤖 **AI Contract Extraction**: Upload PDF or DOCX files and automatically extract key contract details
- 📅 **Smart Reminders**: Get email and SMS reminders 30, 15, and 7 days before renewals
- 📊 **Revenue Tracking**: Track total revenue, expiring contracts, and average rates per client
- 📄 **Contract Templates**: Access professional contract templates for various freelance services
- 🔒 **Secure Storage**: All contracts stored securely in Supabase
- 💰 **Subscription Tiers**: Free and Pro ($9/mo) plans

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Supabase Storage
- **AI**: OpenAI GPT-4o-mini for contract extraction
- **Email**: Resend
- **Payments**: Stripe

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Clerk account
- OpenAI API key
- Resend API key (for email notifications)
- Stripe account (for subscription payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dealping
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.local.example .env.local
   ```

   Required environment variables:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # Resend
   RESEND_API_KEY=your_resend_api_key

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRO_PRICE_ID=price_xxxxx

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase**

   - Create a new Supabase project
   - Run the migration file to create the database schema:
     ```bash
     # In Supabase SQL Editor, run the contents of:
     supabase/migrations/001_initial_schema.sql
     ```
   - Create a storage bucket named `contracts` with public access

5. **Set up Clerk**

   - Create a Clerk application
   - Configure sign-in/sign-up methods
   - Add your app URL to allowed origins

6. **Set up Stripe**

   - Create a Stripe account at [stripe.com](https://stripe.com)
   - Go to Products → Create product:
     - **Pro Plan**: $9/month recurring subscription
   - Copy the Price ID (starts with `price_`)
   - Get your API keys from Developers → API keys
   - Set up webhook endpoint:
     - Go to Developers → Webhooks
     - Add endpoint: `https://your-domain.com/api/stripe/webhook`
     - Select events:
       - `checkout.session.completed`
       - `customer.subscription.updated`
       - `customer.subscription.deleted`
       - `invoice.payment_succeeded`
       - `invoice.payment_failed`
     - Copy the webhook signing secret (starts with `whsec_`)

7. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main tables:

- **users**: User profiles linked to Clerk IDs
- **contracts**: Contract information and metadata
- **reminders**: Scheduled reminders for contract renewals
- **subscriptions**: User subscription plans and status

See `supabase/migrations/001_initial_schema.sql` for the complete schema.

## Setting Up Reminders

To enable automated email reminders, you need to set up a cron job or scheduled task that calls:

```
POST /api/reminders/send
Authorization: Bearer YOUR_CRON_SECRET
```

You can use:
- Vercel Cron Jobs
- GitHub Actions
- A dedicated cron service

Add `CRON_SECRET` to your environment variables for security.

## Project Structure

```
dealping/
├── app/
│   ├── (dashboard)/          # Dashboard routes (protected)
│   │   └── dashboard/
│   │       ├── contracts/    # Contract management
│   │       ├── analytics/    # Revenue analytics
│   │       └── templates/    # Contract templates
│   ├── api/                  # API routes
│   │   ├── contracts/        # Contract CRUD
│   │   └── reminders/        # Reminder system
│   ├── layout.tsx            # Root layout with Clerk
│   └── page.tsx              # Landing page
├── lib/
│   ├── ai/                   # AI extraction logic
│   ├── db/                   # Database types
│   ├── notifications/        # Email/SMS notifications
│   ├── supabase/             # Supabase clients
│   └── utils/                # Utility functions
├── supabase/
│   └── migrations/           # Database migrations
└── middleware.ts             # Auth middleware
```

## Features in Detail

### AI Contract Extraction

When you upload a PDF or DOCX file, the system:
1. Extracts text from the document
2. Uses OpenAI to identify key contract fields
3. Automatically populates contract details
4. Creates reminders based on end dates

### Subscription Tiers

- **Free**: 1 active contract, email reminders only
- **Pro ($9/mo)**: Unlimited contracts, email + SMS, analytics, priority support

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables
4. Deploy

### Set up Cron Jobs

In Vercel, add a cron job configuration in `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/reminders/send",
    "schedule": "0 9 * * *"
  }]
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For support, email support@dealping.app or open an issue on GitHub.
# Dealping
