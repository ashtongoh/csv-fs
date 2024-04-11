import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

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
        <main className="min-h-screen flex flex-col items-center">
          <Providers>
            <NavBar />
            {children}
          </Providers>
          </main>
      </body>
    </html>
  );
}
