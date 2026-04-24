import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "Travsify NDC | The Operating System for Managed Travel",
  description: "Orchestrate global travel distribution with our unified API infrastructure. Flights, Hotels, Transfers, and e-Visas—all in one secure ecosystem.",
  keywords: ["NDC", "Travel API", "Flight Booking", "B2B Travel", "African Travel Tech", "Managed Travel"],
  authors: [{ name: "Travsify Global" }],
  openGraph: {
    title: "Travsify NDC | Global Travel Infrastructure",
    description: "The engine for managed travel distribution.",
    url: "https://travsify.com",
    siteName: "Travsify",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className={`${inter.className} antialiased text-[#0B1F33] bg-[#F8FAFC] selection:bg-[#FF7A00]/20`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
