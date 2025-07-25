import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css'
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from '@/providers/convex-client-provider'
import { ModalProvider } from "@/providers/modal-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <Toaster />
          <ModalProvider />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
