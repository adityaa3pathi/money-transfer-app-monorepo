import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "../provider";
import { AppbarClient } from "../components/AppbarClient";


const inter = Inter({ subsets: ["latin"] });

//made this change to chage to check commit

export const metadata: Metadata = {
  title: "E-wallet",
  description: "simple e-wallet app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <Providers>
     
        <body className={inter.className}>
        <div className="min-w-screen min-h-screen bg-[#ebe6e6]">
          <AppbarClient/>
          {children}
          </div>
          </body>
      </Providers>
    </html>
  );
}
