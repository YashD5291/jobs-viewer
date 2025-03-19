import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import { StatsProvider } from "@/lib/context/StatsContext";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jobs Viewer Dashboard",
  description: "A dashboard to view and filter job listings from various platforms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <ReactQueryProvider>
          <StatsProvider>
            <ThemeProvider>
              <DashboardLayout>{children}</DashboardLayout>
            </ThemeProvider>
          </StatsProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
