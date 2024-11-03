import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";
import prismadb from "../../../lib/prismadb";
import { absoluteUrl } from "../../../lib/utils";

const settingsUrl = absoluteUrl("/settings");

export async function GET() {

  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId,
      },
    });

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      return NextResponse.json(stripeSession.url);
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Pro",
              description: "Unlimited AI Generations",
            },
            unit_amount: 999,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
      mode: "subscription",
    });

    return NextResponse.json({ url: stripeSession.url });

  } catch (error) {
    console.log("[STRIPE_GET_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }

}