import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LLMO Platform | AI Search Visibility Monitor",
  description: "AI検索でのブランド可視性を計測・分析するプラットフォーム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
