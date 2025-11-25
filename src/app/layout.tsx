import { Metadata } from "next";
import { Poppins, Roboto_Slab } from "next/font/google";
import "./globals.css";
import "animate.css";
import AnalyticsWrapper from "./(client)/components/AnalyticsWrapper";
import Script from 'next/script';

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
  // ... vos métadonnées ici
};

export default function RootLayout({ children }:{children:React.ReactNode}) {
  const GA_MEASUREMENT_ID = 'G-56ZB7XCQHC'; // Remplacez par votre ID de mesure

  return (
    <html lang="en">
      <head>
      {/* <script async src="https://apis.google.com/js/api.js"></script> */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Quicksand:wght@300..700&family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet"/>
      </head>
      <body className={`${poppins.className} ${robotoSlab.className}`}>
        <AnalyticsWrapper>
          {children}
        </AnalyticsWrapper>
      </body>
    </html>
  );
}
