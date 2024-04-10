import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { WagmiProvider } from "wagmi";
import { config } from '@/config' 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient(); 

export const metadata: Metadata = {
  title: "CSV App",
  description: "CSV App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <WagmiProvider config={config}> 
      <QueryClientProvider client={queryClient}> 
        {children}
      </QueryClientProvider>
      </WagmiProvider>
      </body>
    </html>
  );
}
