# Stripe Customer Portal Setup

To enable subscription management for your users, you need to configure the Stripe Customer Portal.

## Quick Setup

1. **Go to Stripe Dashboard**
   - Visit: https://dashboard.stripe.com/settings/billing/portal
   - Make sure you're in **Live Mode** (toggle in the top right)

2. **Configure Portal Settings**
   - **Activate the Customer Portal**: Toggle it ON
   - **Business information**: Add your business name and support email
   - **Features to enable**:
     - ✅ Allow customers to update payment methods
     - ✅ Allow customers to cancel subscriptions
     - ✅ Allow customers to update billing details
     - ✅ Allow customers to view invoices
   - **Cancellation settings**: Choose how to handle cancellations
     - Option 1: Cancel immediately
     - Option 2: Cancel at period end (recommended)
   - **Cancellation reasons**: Enable if you want feedback

3. **Save Configuration**
   - Click "Save changes" at the bottom
   - The portal is now active!

## For Test Mode

If you're testing in development:
1. Switch to **Test Mode** in Stripe Dashboard
2. Go to Settings → Billing → Customer Portal
3. Configure the same settings as above
4. Save the configuration

## What Users Can Do

Once configured, users can:
- Update their payment method
- View billing history and invoices
- Cancel their subscription
- Update billing information
- See subscription details

## Troubleshooting

**Error: "No configuration provided"**
- Make sure you've saved the Customer Portal configuration in Stripe Dashboard
- Check that you're in the correct mode (Live vs Test)
- Ensure the configuration is saved (not just viewed)

**Portal not working**
- Verify your Stripe API keys are correct
- Check that the customer ID exists in Stripe
- Ensure the subscription is active

## Next Steps

After configuring:
1. Test the portal by clicking "Manage Subscription" in your app
2. Verify users can update payment methods
3. Test cancellation flow (if enabled)
4. Check that invoices are visible

The portal will automatically use your configured settings for all customers.

