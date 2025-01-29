'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: 'Productivio',
//   description: 'Boost your productivity',
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        > 
        <UserProvider>
          <main id="app" className="d-flex flex-column h-100" data-testid="layout"> 
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
