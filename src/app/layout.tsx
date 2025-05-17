import type { Metadata } from "next";
// import { GeistSans } from "geist/font/sans"; // Removed
// import { GeistMono } from "geist/font/mono"; // Removed
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";

// const geistSans = GeistSans; // Removed
// const geistMono = GeistMono; // Removed

export const metadata: Metadata = {
  title: "Chuyển đổi cơ số",
  description: "Chuyển đổi số giữa các cơ số với giải thích hoạt họa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`font-sans antialiased flex flex-col min-h-screen`} // Removed geistSans.variable and geistMono.variable
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
