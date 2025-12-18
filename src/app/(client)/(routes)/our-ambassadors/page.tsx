"use client";
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Metadata } from "next";

import AmbassadorsListing from "./ambassadorsListing";

import "./styles.scss";
// import { analyticsEventTracker } from "@/app/(client)/lib/google-analytics";
const ScrollToTop = dynamic(() => import("@/app/(client)/lib/scrollToTop"), {
  ssr: false,
});

export const metadata: Metadata = {
  title:
    "_DevStyle Ambassadors | La premiere boutique dedié aux amoureux de la Tech #TT237 Cameroun",
  description:
    "Deviens Ambassadeur et représente avec enthousiasme et passion notre Brand🏆 --- #WeLoveDevStyle💜",
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
    "ambassador",
    "ambassadeur",
  ],
  openGraph: {
    title:
      "_DevStyle Ambassadors | La premiere boutique dedié aux amoureux de la Tech #TT237 Cameroun",
    description:
      "Deviens Ambassadeur et représente avec enthousiasme et passion notre Brand🏆 --- #WeLoveDevStyle💜",
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: "https://dev-style.com/our-ambassadors",
    siteName: "_DevStyle",
    countryName: "Cameroun",
    images: [
      {
        url: "https://dev-style.com/assets/images/metadata/devstyle ambassadors.jpg",
        width: 1280,
        height: 720,
        alt: "_DevStyle Ambassadors",
      },
    ],
  },
  twitter: {
    site: "https://dev-style.com/our-ambassadors",
    creator: "@_devstyle",
    description:
      "Deviens Ambassadeur et représente avec enthousiasme et passion notre Brand🏆 --- #WeLoveDevStyle💜",
    title:
      "_DevStyle Ambassadors | La premiere boutique dedié aux amoureux de la Tech #TT237 Cameroun",
    images: [
      {
        url: "https://dev-style.com/assets/images/metadata/devstyle ambassadors.jpg",
        width: 1280,
        height: 720,
        alt: "_DevStyle Ambassadors",
      },
    ],
    card: "summary_large_image",
  },
};

const Ambassador = () => {
  return (
    <Box className="ambassador-wrapper">
      <ScrollToTop />
      <Box
        className="ambassador-hero-section-wrapper"
        style={{
          background:
            "linear-gradient(147.14deg, #3E7BFA 6.95%, #6600CC 93.05%)",
          overflow: "hidden",
        }}
        padding={10}
      >
        <Box className="ambassador-hero-section-container">
          <Box>
            <Typography className="text animate__animated animate__flipInX animate__delay__1s">
              NOS AMBASSADEURS
            </Typography>
            <Typography className="subtext animate__animated animate__fadeInUp animate_delay-5s animate__slower">
              Ils représentent avec enthousiasme et passion notre <b>Brand🏆</b>
            </Typography>
          </Box>
          <Box className="image-container">
            <Image
              src={"/assets/images/ambassador.png"}
              alt="ambassador hero"
              className="animate__animated animate__fadeInBottomRight animate__delay-1s"
              width={400}
              height={300}
            />
          </Box>
        </Box>
      </Box>
      <AmbassadorsListing />
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Typography>
          Rejoins le programme <b>DSA</b>
        </Typography>
        <a
          href="https://bit.ly/devstyle_ambassador"
          target={"_blank"}
          style={{ textDecoration: "none" }}
          rel="noreferrer"
          //   onClick={() => {
          //     analyticsEventTracker("AMBASSADOR")("become an ambassador");
          //   }}
        >
          <Button className="button">Deviens un _DevStyle Ambassador</Button>
        </a>
      </Box>
    </Box>
  );
};

export default Ambassador;
