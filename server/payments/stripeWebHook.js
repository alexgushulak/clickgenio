import stripe from 'stripe';
import { updateCredits } from '../db.js';
import 'dotenv/config'

export async function stripeWebHook(req, res) {
    let event = req.body;
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

    console.log(event)

    switch (event.type) {
      case 'checkout.session.completed':
        console.log("CHECKOUT SESSION COMPLETED")
        var credits = event.data.object.metadata.credits
        var email = event.data.object.metadata.email
        console.log(`PaymentIntent for ${credits} ${email} was successful!`);
        try {
          updateCredits(email, credits)
        } catch (err) {
          console.log("DB Error: ", err)
        }
        break;
      case 'payment_intent.succeeded':
        console.log("CHECKOUT SESSION COMPLETED")
        console.log(event)
        var credits = event.data.object.metadata.credits
        var email = event.data.object.metadata.email
        console.log(`PaymentIntent for ${credits} ${email} was successful!`);
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