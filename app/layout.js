import "./globals.css";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "../components/Header";
import NextTopLoader from "nextjs-toploader";
import { FloatingAddButton } from "@/components/FloatingAddButton";

import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-arabic",
});

export const metadata = {
  title: "daberha",
  description: "manage your money",
};

export default async function RootLayout({ children }) {
  const lang = "ar";
  const dir = "rtl";

  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsVariant: "iconButton",
          logoImageUrl: "/favicon.ico",
        },
        variables: {
          colorPrimary: "#4CAF50",
          colorText: "#333333",
          colorBackground: "#F0F4F8",
          colorInputBackground: "#FFFFFF",
          colorInputText: "#333333",
          borderRadius: "0.625rem",
          fontFamily: "var(--font-ibm-plex-sans-arabic)",
        },
        elements: {
          card: "shadow-none border border-[#E2E8F0] bg-white",
          navbar: "hidden",
        },
      }}
    >
      <html lang={lang} dir={dir} className={`${inter.variable} ${ibmPlexSansArabic.variable}`}>

        <body className={lang === "ar" ? "font-arabic" : "font-sans"}>
          <NextTopLoader color="#4CAF50" showSpinner={false} zIndex={99999} />
          <Header />
          <main className="min-h-screen bg-background pt-16">{children}</main>
          <Toaster richColors />
        </body>

      </html>
    </ClerkProvider>
  );
}
