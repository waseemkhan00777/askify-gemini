import { BaseLayout } from "@/components/BaseLayout";
import { defaultMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BaseLayout>{children}</BaseLayout>;
}
