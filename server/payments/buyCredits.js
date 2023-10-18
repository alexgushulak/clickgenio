import stripe from 'stripe';
import 'dotenv/config'

export async function checkoutActionBuyCredits(credits, userEmail) {
    const stripeSession = new stripe(process.env.STRIPE_SECRET_KEY);
    let product = ""

    if (credits == 50) {
        product = process.env.PRODUCT_CODE_50
    } else if (credits == 100) {
        product = process.env.PRODUCT_CODE_100
    } else if (credits == 250) {
        product = process.env.PRODUCT_CODE_250
    } else {
        throw Error("Invalid Product Requested")
    }

    const checkoutSession = await stripeSession.checkout.sessions.create({
        submit_type: 'pay',
        metadata: {
          credits: credits,
          userEmail: userEmail
        },
        line_items: [
          {
            price: product,
            quantity: 1
          },
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/generate`,
        cancel_url: `${process.env.CLIENT_URL}/purchase`,
        automatic_tax: {enabled: true},
      });

    return checkoutSession
}