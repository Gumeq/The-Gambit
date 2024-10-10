import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import Navbar from "@/components/navigation/navbar";

export const metadata: Metadata = {
  title: "SpinVibe",
  description: "No Money Casino",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-background antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar>{children}</Navbar>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
