import type { Metadata, Viewport } from "next";
import { Newsreader, Noto_Sans_Ethiopic, Noto_Serif_Ethiopic } from "next/font/google";
import { EditBar } from "@/components/edit-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isAdmin } from "@/lib/auth";
import { loadCopy } from "@/lib/copy";
import { navigation } from "@/lib/site-copy";
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
    "A Ge'ez to Amharic dictionary. Search a word, or send one you know.",
};

export const viewport: Viewport = {
  themeColor: "#f3ead7",
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [copy, signedIn] = await Promise.all([loadCopy(), isAdmin()]);
  const nav = navigation(copy);

  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${ethiopic.variable} ${ethiopicSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader brand={nav.brand} subtitle={nav.subtitle} links={nav.main} contact={nav.contact} />
        <div className="flex-1">{children}</div>
        <SiteFooter
          brand={nav.brand}
          links={[
            { href: "/dictionary", label: nav.main[1].label },
            { href: "/about", label: nav.main[2].label },
            { href: "/about-ha-geez", label: nav.main[3].label },
            { href: "/submit", label: nav.footerSubmit },
            { href: "/contact", label: nav.contact.label },
          ]}
        />
        {signedIn ? <EditBar /> : null}
      </body>
    </html>
  );
}
