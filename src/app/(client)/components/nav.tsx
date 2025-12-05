"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Button,
  Typography,
  useTheme,
  IconButton,
  useMediaQuery,
  Icon,
} from "@mui/material";
import {
  DeleteOutlineRounded,
  Close,
  HorizontalSplitOutlined,
  ChevronRightRounded,
} from "@mui/icons-material";

import CartContext from "../contexts/cart/cartContext";
import myAxios from "@/app/(client)/lib/axios.config";
import "./nav.scss";
// import { analyticsEventTracker } from "../app";
import {
  getCartCount,
  getTotalPrice,
  calculatePromoPrice,
} from "@/app/(client)/lib/utils-script";
import { IAnnouncement, ICart } from "@/app/lib/interfaces";
import SearchBar from "./searchBar";

const Nav = () => {
  const theme = useTheme();
  const matches = useMediaQuery("(max-width:1365px)");
  const match = useMediaQuery("(max-width:1000px)");
  const match400 = useMediaQuery("(min-width:400px)");

  const [announce, setAnnounce] = useState<IAnnouncement>();

  const [goodies, setGoodies] = useState([]);

  const { cartContent: cart, cartDispatch } = useContext(CartContext);
  const handleSideNav = () => {
    const element = document.querySelector("#side-nav");

    element?.classList.toggle("hide");
    element?.classList.toggle("animate__slideInRight");
  };

  const handleDownNav = () => {
    const element = document.querySelector("#down-nav");

    element?.classList.toggle("hide");
    element?.classList.toggle("animate__slideInDown");
  };

  useEffect(() => {
    myAxios
      .get("/announcement")
      .then((response: any) => {
        if (response.status === 200) {
          setAnnounce(response.data.message);
        } else {
          console.log(response.data.message);
        }
      })
      .catch((error: any) => console.log(error));
  }, []);

  useEffect(() => {
    myAxios
    .get("/goodie/all")
    .then((response) => {
      if (response.status === 200) {
        
        setGoodies(response.data.message)
       
      } else {
        console.log(response.data.message);
      }
    })
    .catch((error) => {
    
      console.log(error);
    });
  }, []);

  useEffect(() => {
    try {
      let cartFromLocalStorage = JSON.parse(
        localStorage.getItem("devStyle_cart") ?? ""
      ) as ICart;
      if (cartFromLocalStorage) {
        cartDispatch({ type: "SET_CART", payload: cartFromLocalStorage });
      }
    } catch (error) {
      console.log(error);
    }
  }, [cartDispatch]);
  return (
    <Box id="nav-wrapper" paddingX={match ? "10%" : 12} paddingY={4}>
      {/* Christmas Design 🎄🎅🏾*/}
      {/* 
      <ul class="lightrope">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul> */}
      <Box
        className="nav-container"
        style={
          matches ? { display: "flex", justifyContent: "space-between" } : {}
        }
      >
        <Box className="nav-logo">
          <Link href={"/"}>
            <Image
              src="/assets/images/devstyle-logo.png"
              width={500}
              height={500}
              alt="Devstyle logo"
            />
          </Link>
        </Box>
        {!matches ? (
          <Box className="middle-links">
            <Link
              href={"/"}
              style={{
                padding: `0px ${theme.spacing(2)}`,
                color: theme.palette.common.black,
              }}
            >
              Accueil
            </Link>
            <Link
              href="/#our-collections-section"
              style={{
                padding: `0px ${theme.spacing(2)}`,
                color: theme.palette.common.black,
              }}
              onClick={() => {
                try {
                  if (document.querySelector("#our-collections-section")) {
                    document
                      .querySelector("#our-collections-section")
                      ?.scrollIntoView(true);
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Nos Collections
            </Link>
            {/* <Link
              href={"/our-ambassadors"}
              style={{
                padding: `0px ${theme.spacing(2)}`,
                color: theme.palette.common.black,
              }}
            >
              Nos Ambassadeurs
            </Link> */}
            <Link
              href={"/about-us"}
              style={{
                padding: `0px ${theme.spacing(2)}`,
                color: theme.palette.common.black,
              }}
            >
              Qui sommes-nous ?
            </Link>
          </Box>
        ) : null}
        <Box className="right-actions">
          <SearchBar goodies = {goodies} />

          {!matches ? (
            <>
              <Button
                className="custom-goodies-buttom"
                onClick={() => {
                  try {
                    // analyticsEventTracker("CUSTOM GOODIE")(
                    //   "go to custom goodie section"
                    // );
                    if (document.querySelector("#custom-section")) {
                      document
                        .querySelector("#custom-section")
                        ?.scrollIntoView(true);
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                Goodies customisé
              </Button>
            </>
          ) : (
            <IconButton onClick={() => handleDownNav()}>
              <HorizontalSplitOutlined fontSize="large" color="primary" />
            </IconButton>
          )}
          <Box className="cart-button" onClick={() => handleSideNav()}>
            {/* eslint-disable-next-line @next/next/no-img-element*/}
            <img src={"/assets/icons/cart.png"} alt="cart icon" />
            <span>{getCartCount(cart) ?? 0}</span>
          </Box>
        </Box>
      </Box>
      {announce?._id && (
        <Box className="notif-wrapper animate__animated animate__rotateInDownLeft">
          <a
            href={announce.link}
            style={{ width: "auto", textDecoration: "none" }}
            onClick={() => {
              // analyticsEventTracker("ANNOUNCEMENT")("click announcement");
            }}
          >
            <Typography className="notif" component={"span"}>
              {match400 && <Box className="title">Annonce</Box>}
              <Typography className="text">{announce.text}</Typography>
              {announce.link && (
                <Box className="icon">
                  <ChevronRightRounded color="warning" />
                </Box>
              )}
            </Typography>
          </a>
        </Box>
      )}
      <Box
        id="down-nav"
        className="hide animate__animated animate__faster"
        padding={3}
        display="flex"
        flexDirection={"column"}
      >
        <Box
          display={"flex"}
          justifyContent="space-between"
          alignItems="center"
          width={"100%"}
          height={"40px"}
          position={"relative"}
        >
          <Image
            src="/assets/images/devstyle-white-logo.png"
            alt="Devstyle logo"
            width={150}
            height={150}
          />

          <IconButton onClick={() => handleDownNav()}>
            <Image
              src="/assets/icons/close.png"
              alt="close icon"
              width={30}
              height={30}
            />
          </IconButton>
        </Box>
        <Box className="links">
          <Link
            href={"/"}
            onClick={() => handleDownNav()}
            style={{
              padding: `0px ${theme.spacing(2)}`,
              color: theme.palette.common.black,
            }}
          >
            Accueil
          </Link>
          <Link
            href={"/#our-collections-section"}
            onClick={() => {
              try {
                if (document.querySelector("#our-collections-section")) {
                  handleDownNav();
                  document
                    .querySelector("#our-collections-section")
                    ?.scrollIntoView(true);
                }
              } catch (error) {
                console.log(error);
              }
            }}
            style={{
              padding: `0px ${theme.spacing(2)}`,
              color: theme.palette.common.black,
            }}
          >
            Shop
          </Link>
          <Link
            href={"/our-ambassadors"}
            onClick={() => handleDownNav()}
            style={{
              padding: `0px ${theme.spacing(2)}`,
              color: theme.palette.common.black,
            }}
          >
            Nos Ambassadeurs
          </Link>
          <Link
            href={"/about-us"}
            onClick={() => handleDownNav()}
            style={{
              padding: `0px ${theme.spacing(2)}`,
              color: theme.palette.common.black,
            }}
          >
            Qui sommes-nous ?
          </Link>
        </Box>
        <Button
          className="custom-goodies-buttom"
          onClick={() => {
            // analyticsEventTracker("CUSTOM GOODIE")(
            //   "go to custom goodie section"
            // );
            try {
              if (document.querySelector("#custom-section")) {
                handleDownNav();
                document.querySelector("#custom-section")?.scrollIntoView(true);
              }
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Goodies customisé
        </Button>
      </Box>
      <Box
        id="side-nav"
        className="hide animate__animated animate__faster"
        padding={3}
        display="flex"
        flexDirection={"column"}
      >
        <Box display={"flex"} justifyContent="flex-start" alignItems="center">
          <IconButton onClick={() => handleSideNav()}>
            <Close />
          </IconButton>
          <Typography>Fermer</Typography>
        </Box>
        <Box paddingY={"20px"}>
          <Typography style={{ fontSize: "24px", fontWeight: "bold" }}>
            Mon Panier
          </Typography>
        </Box>
        {Object.values(cart).map((goodie, i) => (
          <Box
            key={"cart-" + goodie.cartID + "-" + i}
            display="flex"
            width={"100%"}
            justifyContent="flex-start"
            alignItems="flex-start"
            paddingBottom={2}
          >
            <Box
              bgcolor={
                goodie.backgroundColors[
                  goodie.images.findIndex(
                    (image) => image.url === goodie.mainImage.url
                  )
                ] ?? goodie.backgroundColors[0]
              }
              height="64px"
              width="64px"
              display="flex"
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Box
                style={{ height: "75%", width: "100%" }}
                position={"relative"}
              >
                <Image
                  src={goodie.mainImage.url}
                  objectFit="contain"
                  alt="goodie"
                  fill={true}
                />
              </Box>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"flex-start"}
              flexDirection={"column"}
              paddingX={1}
              width={"calc(100% - 64px)"}
            >
              <Box display={"flex"} justifyContent={"space-between"}>
                <Link
                  href={"/goodie/" + goodie.slug}
                  style={{
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                  onClick={() => handleSideNav()}
                >
                  {goodie.name}
                </Link>
                <Box style={{ fontSize: "10px" }}>
                  {goodie.quantity} ×{" "}
                  {goodie.inPromo
                    ? calculatePromoPrice(goodie.price, goodie.promoPercentage)
                    : goodie.price}{" "}
                  FCFA
                </Box>
              </Box>
              <Box
                display={"flex"}
                justifyContent={"flex-start"}
                alignItems={"center"}
                paddingY={0.5}
                width={"100%"}
              >
                {goodie.selectedSize && (
                  <>
                    <Typography style={{ fontSize: "12px" }}>color</Typography>
                    <Box
                      style={{
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                        background: goodie.selectedColor,
                        height: "24px",
                        width: "24px",
                        borderRadius: "50%",
                        margin: " 0 5px",
                      }}
                    ></Box>
                  </>
                )}{" "}
                &nbsp;
                {goodie.selectedSize && (
                  <>
                    <Typography style={{ fontSize: "12px" }}>size</Typography>
                    <Box
                      style={{
                        height: "24px",
                        width: "24px",
                        margin: "0 5px",
                        border: "1px solid #000000",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "14px",
                      }}
                    >
                      <span>{goodie.selectedSize}</span>
                    </Box>
                  </>
                )}
                <Box
                  style={{
                    marginLeft: "auto",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() =>
                      cartDispatch({
                        type: "DELETE_FROM_CART",
                        payload: goodie.cartID,
                      })
                    }
                  >
                    <DeleteOutlineRounded />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}

        <Box marginTop="auto" paddingY={1} bgcolor="white">
          <Box
            display={"flex"}
            justifyContent="space-between"
            alignItems="center"
            marginY={1}
          >
            <Typography>Total</Typography>{" "}
            <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
              {getTotalPrice(cart) ?? 0} FCFA
            </Typography>
          </Box>
          <Link href="/checkout" style={{ textDecoration: "none" }}>
            <Button
              style={{
                width: "100%",
                backgroundColor: "#220f00",
                color: "white",
                height: "56px",
              }}
              onClick={() => handleSideNav()}
            >
              Finaliser ma commande
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Nav;
