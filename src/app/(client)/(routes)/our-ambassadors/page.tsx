import React from "react";
import { Box, Typography, Button } from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

import AmbassadorsListing from "./ambassadorsListing";

import "./styles.scss";
// import { analyticsEventTracker } from "../app";
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
const notReady = true;
const Ambassador = () => {
  return notReady ? (
    <Box
      sx={{
        minHeight: "calc(100vh - 80px)", // Adjust based on navbar/footer height
        // background:
        //   "linear-gradient(147.14deg, #3E7BFA 6.95%, #6600CC 93.05%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        // color: "white",
        padding: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          mb: 4,
          position: "relative",
          width: { xs: 150, md: 200 },
          height: { xs: 50, md: 70 },
        }}
      >
        <Image
          src="/assets/images/devstyle-logo.png"
          alt="_DevStyle Logo"
          fill
          style={{ objectFit: "contain" }}
        />
      </Box>

      <Typography
        variant="h2"
        component="h1"
        sx={{
          fontWeight: 900,
          fontFamily: "Poppins, sans-serif",
          textTransform: "uppercase",
          mb: 2,
          fontSize: { xs: "2.5rem", md: "4rem" },
        }}
      >
        Nos Ambassadeurs
      </Typography>

      <Box
        sx={{
          // backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          padding: { xs: 3, md: 5 },
          borderRadius: 4,
          maxWidth: "600px",
          width: "100%",
          // boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          color: "white",
          background:
            "linear-gradient(147.14deg, #3E7BFA 6.95%, #6600CC 93.05%)", 
          border: "0.1px solid rgba(255, 255, 255, 0.18)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontFamily: "Poppins, sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          COMING SOON
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: "1.1rem",
            opacity: 0.9,
            lineHeight: 1.6,
          }}
        >
          Cette page est actuellement en cours de construction. Nous préparons
          quelque chose d'exceptionnel pour nos ambassadeurs. Restez à
          l'affût !
        </Typography>

        <Button
          component={Link}
          href="/home"
          variant="outlined"
          sx={{
            mt: 2,
            backgroundColor: "white",
            color: "#6600CC",
            fontWeight: "bold",
            borderRadius: "5px",
            padding: "5px 20px",
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "#f0f0f0",
              transform: "scale(1.05)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Retour à l'accueil
        </Button>
      </Box>
    </Box>
  ) : (
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
