import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JDVerse",
  description: "Paste your JD, Get Must-have , Nice to have Skills and Red Flags",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
