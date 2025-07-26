"use client";

import Image from "next/image";
import { useState } from "react";
import { Poppins } from "next/font/google";
import { useOrganization } from "@clerk/nextjs";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useProModal } from "@/store/use-pro-modal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import Razorpay from "razorpay";
import { useAction } from "convex/react";
// Remove this import, Razorpay is loaded via script on the client side

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Add Razorpay type declaration for window
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const ProModal = () => {
  const { isOpen, onClose } = useProModal();
  const [pending, setPending] = useState(false);
  const { organization } = useOrganization();

  const createOrder = useAction(api.createOrder); // Assumes backend returns { orderId }
  
  const onClick = async () => {
    if (!organization?.id) return;
    setPending(true);

    try {
      const response = await createOrder({ orgId: organization.id }); // Make sure this API exists
      const { orderId } = response;

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Must be set in env
        amount: 2000 * 100, // ₹2000 in paise
        currency: "INR",
        name: "YourSpace Pro",
        description: "Unlimited boards, tools, and organizations",
        order_id: orderId,
        handler: async function (response: any) {
          // You can optionally call backend to verify payment
          window.location.reload();
        },
        prefill: {
          email: organization?.id + "@example.com", // Dummy email or fetch user's email
        },
        theme: {
          color: "#6366f1",
        },
      });

      razorpay.open();
    } catch (err) {
      console.error(err);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[340px] p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image src="/pro.svg" alt="Pro" className="object-fit" fill />
        </div>
        <div
          className={cn("text-neutral-700 mx-auto space-y-6 p-6", font.className)}
        >
          <h2 className="font-md text-lg">🚀Upgrade to Pro</h2>
          <div className="pl-3">
            <ul className="text-[11px] space-y-1 list-desc">
              <li>Unlimited boards</li>
              <li>Unlimited tools</li>
              <li>Unlimited organizations</li>
              <li>Unlimited members</li>
            </ul>
          </div>
          <Button size="sm" className="w-full" onClick={onClick} disabled={pending}>
            {pending ? "Processing..." : "Upgrade"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
