import type { Metadata, Viewport } from "next";
import { Newsreader, Noto_Sans_Ethiopic, Noto_Serif_Ethiopic } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const ethiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ethiopic",
  display: "swap",
});

const ethiopicSerif = Noto_Serif_Ethiopic({
  subsets: ["ethiopic", "latin"],
  weight: ["500", "700"],
  variable: "--font-ethiopic-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ሀ ግእዝ",
    template: "%s · ሀ ግእዝ",
  },
  description:
    "A community lexicon from Ge'ez into Amharic. Search published headwords, or submit a word for an editor to review.",
};

export const viewport: Viewport = {
  themeColor: "#f3ead7",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${ethiopic.variable} ${ethiopicSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
