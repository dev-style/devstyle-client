"use client";

import React from "react";
import { Grid, Button, Typography, useMediaQuery, Box } from "@mui/material";
import Image from "next/image";

import "./customize.scss";
// import { analyticsEventTracker } from "../app";

const Customize = () => {
  const match900 = useMediaQuery("(max-width:900px)");

  const contactForCustomGoodie = () => {
    // analyticsEventTracker("CONTACT")("contact for custom goodie");
    window
      .open(
        `https://api.whatsapp.com/send/?phone=237654017521&text=${encodeURIComponent(`*#CustomGoodie*📌

        Hello _DevStyle

        `)}`,
        "_blank"
      )
      ?.focus();
  };

  const contactForPartnership = () => {
    // analyticsEventTracker("CONTACT")("contact for partnership");
    window
      .open(
        `https://api.whatsapp.com/send/?phone=237654017521&text=${encodeURIComponent(`*#Partnership*📌

      Hello _DevStyle

      `)}`,
        "_blank"
      )
      ?.focus();
  };

  return (
    <Grid container className="custom-section" id="custom-section">
      <Grid
        item
        xs={12}
        md={6}
        paddingY={8}
        paddingX={match900 ? 4 : 8}
        className="info-box"
        bgcolor={"#FFC1BD"}
        alignItems={"flex-start"}
      >
        <Typography className="title">
          Obtenez des goodies sur mesure specialement fait pour vous !
        </Typography>
        <Typography className="text">
          Souhaitez-vous avoir un T-shirt super cool personnalisé avec un
          QR-code unique qui redirigera vers votre compte github
          <Image
            src="/assets/icons/github.png"
            alt="github icon"
            width={16}
            height={16}
            style={{
              display: "inline",
              margin: "-4px 3px 0 ",
            }}
          />
          😏? avoir sur un T-shirt ou Mug vos meilleures lignes de code
          <Image
            src="/assets/icons/vscode.png"
            alt="visual code icon"
            width={16}
            height={16}
            style={{
              display: "inline",
              margin: "-4px 3px 0 ",
            }}
          />
          😎? où toutes autres idées que vous avez en tête, une seul chose à
          faire...
        </Typography>
        <Button className="button" onClick={() => contactForCustomGoodie()}>
          Contactez-Nous{" "}
        </Button>
      </Grid>
      {!match900 && (
        <Image
          src="/assets/images/saly.png"
          alt="saly illustration"
          className="saly"
          objectFit="contain"
          fill={true}
          style={{
            zIndex: 1,
          }}
        />
      )}

      <Grid
        item
        xs={12}
        md={6}
        paddingY={8}
        paddingX={match900 ? 4 : 8}
        className="info-box"
        bgcolor={"#8FC8FF"}
        alignItems={"flex-end"}
        overflow={"hidden"}
        height={"500px"}
        position={"relative"}
      >
        {match900 && (
          <Image
            src="/assets/images/saly.png"
            alt="saly illustration"
            style={{
              position: "absolute",
              left: -285,
              bottom: 0,
              transform: "rotateY(180deg)",
            }}
            objectFit="contain"
            fill={true}
          />
        )}

        <Typography
          className="title"
          style={{ textAlign: "right", width: "80%" }}
        >
          Pour tout autre chose
        </Typography>
        <Typography className="text" style={{ textAlign: "right" }}>
          Discuter, partenariat, couverture d’événements etc. N’hesitez pas..
        </Typography>
        <Button className="button" onClick={() => contactForPartnership()}>
          Contactez-Nous Ici
        </Button>
      </Grid>
    </Grid>
  );
};

export default Customize;
