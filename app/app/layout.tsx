import "./globals.css";
import { Providers } from "@/providers";
import { AppHeader } from "@/components/app-header";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <Providers>
          <div className="min-h-screen">
            <AppHeader />
            <main className="mx-auto w-full max-w-5xl px-4 py-10">{children}</main>
            <footer className="border-t border-foreground/10">
              <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-foreground/70 sm:flex-row sm:items-center sm:justify-between">
                <p>Built for Base Sepolia · Onchain-first receipts</p>
                <p className="text-foreground/50">Data is stored onchain and publicly readable.</p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
