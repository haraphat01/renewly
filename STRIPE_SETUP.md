# Stripe Integration Setup Guide

This guide will help you set up Stripe for subscription payments in Renewly.

## Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the onboarding process
3. Switch to **Test Mode** for development

## Step 2: Create Products and Prices

### Create Pro Plan ($9/month)

1. Go to **Products** in Stripe Dashboard
2. Click **Add product**
3. Fill in:
   - **Name**: Pro Plan
   - **Description**: Unlimited contracts, email + SMS, analytics
   - **Pricing model**: Standard pricing
   - **Price**: $9.00 USD
   - **Billing period**: Monthly
4. Click **Save product**
5. Copy the **Price ID** (starts with `price_`)


## Step 3: Get API Keys

1. Go to **Developers** → **API keys**
2. Copy:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode)

## Step 4: Set Up Webhook

### For Local Development (using Stripe CLI)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`)

### For Production

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

## Step 5: Update Environment Variables

Add to your `.env.local`:

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRO_PRICE_ID=price_xxxxx
```

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Go to `/dashboard/upgrade`
3. Click "Upgrade to Pro" or "Upgrade to Premium"
4. Use Stripe test card: `4242 4242 4242 4242`
5. Use any future expiry date and any CVC
6. Complete the checkout
7. Check your Stripe Dashboard → Customers to see the subscription

## Testing Webhooks Locally

1. Install Stripe CLI
2. Run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. Complete a test checkout
4. You should see webhook events in the terminal

## Production Checklist

- [ ] Switch Stripe to **Live Mode**
- [ ] Create live products and prices
- [ ] Update environment variables with live keys
- [ ] Set up production webhook endpoint
- [ ] Test checkout flow in production
- [ ] Verify webhook events are received

## Common Issues

### Webhook not receiving events
- Check webhook endpoint URL is correct
- Verify webhook secret matches
- Check Stripe Dashboard → Webhooks for error logs

### Subscription not updating in database
- Check webhook handler logs
- Verify database connection
- Check user_id mapping is correct

### Checkout session not creating
- Verify Stripe API keys are correct
- Check Price IDs match your Stripe products
- Ensure NEXT_PUBLIC_APP_URL is set correctly

## Support

For Stripe-specific issues, check:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

