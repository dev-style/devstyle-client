import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import { IGoodie } from "@/app/lib/interfaces";
import {
  calculatePromoPrice,
  scrollToTop,
} from "@/app/(client)/lib/utils-script";
import { ArrowForwardIosRounded } from "@mui/icons-material";
import "./goodieCard.scss";

const GoodieCard = ({
  _id,
  name,
  mainImage,
  price,
  promoPercentage,
  inPromo,
  backgroundColors,
  availableColors,
  slug,
}: IGoodie) => {
  return (
    <Box
      className="goodie-card-wrapper animate__animated animate__fadeIn"
      key={_id}
    >
      <Link
        href={`/goodie/${slug}`}
        style={{ textDecoration: "none" }}
        onClick={() => scrollToTop()}
      >
        <Box className="goodie-card-container">
          <Box className="top" bgcolor={backgroundColors[0]}>
            {inPromo && <Box className="promo">-{promoPercentage}%</Box>}
            <img src={mainImage.url} alt="goodie" className="image " />
          </Box>
          <Box className="bottom" paddingX={2} paddingY={1}>
            <Typography className="name">{name}</Typography>
            <Box className="price-container">
              <Typography className="current-price">
                {inPromo ? calculatePromoPrice(price, promoPercentage) : price}{" "}
                FCFA
              </Typography>{" "}
              {inPromo && (
                <Typography
                  style={{ color: "#ff3b3b", textDecoration: "line-through" }}
                >
                  <Typography className="real-price">{price} FCFA</Typography>
                </Typography>
              )}
              <Box
                style={{
                  marginLeft: "auto",
                }}
              >
                <ArrowForwardIosRounded />
              </Box>
            </Box>
            <Box className="colors-container">
              {/* <Typography className="colors-label">Colors</Typography> */}

              {availableColors.map((color, index) => (
                <Box key={index} className="color-circle" bgcolor={color}></Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Link>
    </Box>
  );
};

export default GoodieCard;
