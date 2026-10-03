import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oboeru — Japanese study companion",
  description: "คลังเรียนภาษาญี่ปุ่นแบบ local-first สำหรับหนังสือของคุณ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
