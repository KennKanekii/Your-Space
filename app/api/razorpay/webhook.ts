import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const signature = req.headers["x-razorpay-signature"] as string;
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).send("Invalid signature.");
  }

  const event = req.body;

  if (event.event === "payment.captured") {
    const paymentData = event.payload.payment.entity;

    // Update your database - Example (pseudo-code)
    // await db.subscriptions.update({ orgId }, { isSubscribed: true });

    console.log("Payment successful:", paymentData.id);

    res.status(200).json({ received: true });
  } else {
    res.status(200).json({ message: "Unhandled event." });
  }
}
