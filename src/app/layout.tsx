import type { Metadata } from "next";
import { Poppins, Roboto_Slab } from "next/font/google";
import "./globals.css";
import "animate.css";
import { GoogleAnalytics } from '@next/third-parties/google'
import AnalyticsWrapper from "./(client)/components/AnalyticsWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
});

export const metadata: Metadata = {
  title: {
    template:
      "%s | EXPRIME TA PASSION POUR LA TECH_ | La premiere boutique dedié aux amoureux de la Tech #TT237 Cameroun",
    default:
      "_DevStyle | EXPRIME TA PASSION POUR LA TECH_ | La premiere boutique dedié aux amoureux de la Tech #TT237",
  },
  description:
    "Devstyle est une platforme de vente des Tshirts, Stickers, Hoodies, Mugs, Hats, Sweatshirts, Polos, Posters, et Bracelets pour les amoureux de la Tech #TT237 Cameroun",
  keywords: [
    "devstyle",
    "developer",
    "developpeur",
    "cameroon",
    "cameroun",
    "douala",
    "boutique",
    "tshirt",
    "hoodie",
    "sticker",
    "pulles",
    "chapeau",
    "boutique",
    "mug",
    "hat",
    "sweatshirt",
    "polo",
  ],
  openGraph: {
    title: {
      template:
        "%s | EXPRIME TA PASSION POUR LA TECH_ | La premiere boutique dedié aux amoureux de la Tech #TT237 Cameroun",
      default:
        "_DevStyle | EXPRIME TA PASSION POUR LA TECH_ | La premiere boutique dedié aux amoureux de la Tech #TT237",
    },
    description:
      "Devstyle est une platforme de vente des Tshirts, Stickers, Hoodies, Mugs, Hats, Sweatshirts, Polos, Posters, et Bracelets pour les amoureux de la Tech #TT237 Cameroun",
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: "https://dev-style.com",
    siteName: "_DevStyle",
    countryName: "Cameroun",
    images: [
      {
        url: "https://dev-style.com/assets/images/metadata/devstyle.jpg",
        width: 1280,
        height: 720,
        alt: "DevStyle",
      },
    ],
  },
  twitter: {
    site: "https://dev-style.com",
    creator: "@_devstyle",
    description:
      "Devstyle est une platforme de vente des Tshirts, Stickers, Hoodies, Mugs, Hats, Sweatshirts, Polos, Posters, et Bracelets pour les amoureux de la Tech #TT237 Cameroun. #EtreDeveloppeurPlusQu'unMetierC'estUnStyleDeVie #devStyle #devAttitude",
    title: {
      template:
        "%s | EXPRIME TA PASSION POUR LA TECH_ | La premiere boutique dedié aux amoureux de la Tech #TT237 Cameroun",
      default:
        "_DevStyle | EXPRIME TA PASSION POUR LA TECH_ | La premiere boutique dedié aux amoureux de la Tech #TT237",
    },
    images: [
      {
        url: "https://dev-style.com/assets/images/metadata/devstyle.jpg",
        width: 1280,
        height: 720,
        alt: "DevStyle",
      },
    ],
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  

  return (
    <html lang="en">
      <body className={(poppins.className, robotoSlab.className)}>
        <AnalyticsWrapper>

        {children}
        </AnalyticsWrapper>
        <GoogleAnalytics gaId="G-YYXJ342517" />

      </body>
    </html>
  );
}
