import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "../public/fonts/Inter.ttf",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const playfair = localFont({
  src: "../public/fonts/PlayfairDisplay.ttf",
  variable: "--font-playfair",
  weight: "400 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vertex | Search your learning",
  description: "Find the exact lessons you need across all your courses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" className={`${inter.variable} ${playfair.variable}`}><body>{children}</body></html>;
}
