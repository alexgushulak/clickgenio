import stripe from 'stripe';
import { updateCredits } from '../db.js';
import 'dotenv/config'

export async function stripeWebHook(req, res) {
    let event = req.body;
    console.log(event)
    // if (endpointSecret) {
    //   const signature = req.headers['stripe-signature'];
    //   try {
    //     event = stripe.webhooks.constructEvent(
    //       request.body,
    //       signature,
    //       endpointSecret
    //     );
    //   } catch (err) {
    //     console.log(`⚠️  Webhook signature verification failed.`, err.message);
    //     return res.sendStatus(400);
    //   }
    // }
  
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const credits = event.data.object.metadata.credits
        const email = event.data.object.metadata.email
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        try {
          updateCredits(email, credits)
        } catch (err) {
          console.log("DB Error: ", err)
        }
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }
  
    return res.sendStatus(200)
};