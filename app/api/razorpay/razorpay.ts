import Razorpay from "razorpay";
import { v } from "convex/values";
import { action } from "@/convex/_generated/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});


interface CreateOrderArgs {
  orgId: string;
}

interface CreateOrderResult {
  orderId: string;
}

export const createOrder = action({
  args: { orgId: v.string() },
  handler: async (
    ctx: any,
    args: CreateOrderArgs
  ): Promise<CreateOrderResult> => {
    const order: { id: string } = await razorpay.orders.create({
      amount: 2000 * 100, // ₹2000 in paise
      currency: "INR",
      receipt: `receipt_${args.orgId}_${Date.now()}`,
    });

    return { orderId: order.id };
  },
});