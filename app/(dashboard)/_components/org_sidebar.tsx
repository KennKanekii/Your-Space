'use client'

import Link from 'next/link'
import Image from 'next/image'
import { toast } from "sonner";
import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { useSearchParams } from 'next/navigation'
import { Poppins } from 'next/font/google'
import { Banknote, LayoutDashboard, Star } from 'lucide-react'
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";

const font = Poppins({ subsets: ['latin'], weight: ['600'] })

export const OrgSidebar = () => {
  const searchParams = useSearchParams()
  const favorites = searchParams.get("favorites");

  const { organization } = useOrganization();

  const [pending, setPending] = useState(false);

  const createOrder = async () => {
    const res = await fetch("/api/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 2000 }), // ₹2000 example
    });
    return res.json();
  };

  const onClick = async () => {
    if (!organization?.id) return;
    setPending(true);

    try {
      const order = await createOrder();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: "YourSpace Pro",
        description: "Unlimited boards for your organization",
        order_id: order.id,
        handler: function (response: any) {
          // Optionally send response to backend here for verification
          toast.success("Payment Successful!");
          console.log(response);
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: { color: "#ffbf42" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Payment failed. Try again.");
    } finally {
      setPending(false);
    }
  };

  const orgTileStyles = {
    variables: {
      colorPrimary: '#ffbf42',
      colorAlphaShade: '#ffbf42',
    },
    elements: {
      rootBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: '376px',
      },
      organizationSwitcherTrigger: {
        padding: '6px',
        width: '100%',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        justifyContent: 'space-between',
        backgroundColor: 'white',
      },
    },
  }

  return (
    <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
      <Link href="/">
        <div className="flex items-center gap-x-2">
          <Image src="/logo.svg" alt="Logo" height={28} width={28} />
          <span className={cn('font-semibold text-2xl', font.className)}>
            YourSpace
          </span>

        </div>
      </Link>
      <OrganizationSwitcher hidePersonal appearance={orgTileStyles} />
      <div className="space-y-1 w-full">
        <Button
          variant={favorites ? 'ghost' : 'secondary'}
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link href="/">
            <LayoutDashboard className="h-4 w-4 mr-2 stroke-amber" />
            Team boards
          </Link>
        </Button>
        <Button
          variant={favorites ? 'secondary' : 'ghost'}
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link href={{ pathname: "/", query: { favorites: true } }}>
            <Star className="h-4 w-4 mr-2" /> Favorite boards
          </Link>
        </Button>
        <Button
          onClick={onClick}
          disabled={pending}
          variant="ghost"
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Banknote className="h-4 w-4 mr-2" />
          {pending ? "Processing..." : "Upgrade with Razorpay"}
        </Button>
      </div>
    </div>
  );
};

export default OrgSidebar;