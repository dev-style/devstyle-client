"use client";
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { ICollection, IGoodie } from "@/app/lib/interfaces";

import GoodieCard from "@/app/(client)/components/goodieCard";
import GoodieCardSkeleton from "@/app/(client)/components/goodieCardSkeleton";
import Spinner from "@/app/(client)/components/spinner";

import { importAll, scrollToTop } from "@/app/(client)/lib/utils-script";
import myAxios from "@/app/(client)/lib/axios.config";
import "./style.scss";
// import { useUpdateClickCountMutation } from "@/app/admin/redux/features/affiliation/affiliationsApi";
// import { analyticsEventTracker } from "../app";

const Home = ({ searchParams }: { searchParams: { affiliate: string } }) => {
  console.log("searchParam", searchParams?.affiliate);

  // const [updateClickCount, { isLoading, isSuccess, error }] =
  //   useUpdateClickCountMutation();

  // useEffect(() => {
  //   const getClickCount = localStorage.getItem("affiliate");

  //   if (searchParams.affiliate) {
  //     if (getClickCount && getClickCount === searchParams.affiliate) {
  //     } else {
  //       localStorage.setItem("affiliate", searchParams.affiliate);

  //       console.log("testes");
  //       const fetchUpdateClickCount = async () => {
  //         await updateClickCount({ affiliate: searchParams?.affiliate });
  //       };

  //       fetchUpdateClickCount();
  //     }
  //   }
  // }, []);

  const HeroImages = importAll(
    require
      .context(
        "../../../../../public/assets/images/hero/",
        false,
        /\.(png|jpe?g)$/
      )
      .keys()
  );

  const hero_images: {
    _id: number;
    image: { url: string };
  }[] = Object.values(HeroImages).map((image, i) => ({
    _id: i,
    image: { url: image },
  }));

  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [trendingGoodies, setTrendingGoodies] = useState<IGoodie[]>([]);
  const [newGoodies, setNewGoodies] = useState<IGoodie[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] =
    useState<boolean>(true);
  const [heroSection, setHeroSection] = useState(
    hero_images.length > 0 ? [...hero_images] : []
  );
  const [isLoadingTrendingGoodies, setIsLoadingTrendingGoodies] =
    useState(true);
  const [isLoadingNewGoodies, setIsLoadingNewGoodies] = useState(true);
  // const [isLoadingHeroSection, setIsLoadingHeroSection] = useState(true);

  const match1000 = useMediaQuery("(max-width:1000px)");
  const match900 = useMediaQuery("(max-width:900px)");

  const handleHeroImageChange = (step: string) => {
    const element = document.querySelector<HTMLElement>("#hero-image");
    let next = 1;
    if (step === "back") {
      element?.classList.add("animate__animated", "animate__fadeOutRight");
      element?.addEventListener("animationend", () => {
        next =
          heroImageIndex === 0
            ? Object.keys(heroSection).length - 1
            : heroImageIndex - 1;
        setHeroImageIndex(next);
        element?.classList.remove(
          "animate__animated",
          "animate__fadeOutRight",
          "animate__fadeInRight"
        );
        element.classList.add("animate__animated", "animate__fadeInLeft");
      });
    } else {
      element?.classList.add("animate__animated", "animate__fadeOutLeft");
      element?.addEventListener("animationend", () => {
        next =
          heroImageIndex === Object.keys(heroSection).length - 1
            ? 0
            : heroImageIndex + 1;
        setHeroImageIndex(next);
        element?.classList.remove(
          "animate__animated",
          "animate__fadeOutLeft",
          "animate__fadeInLeft"
        );
        element?.classList.add("animate__animated", "animate__fadeInRight");
      });
    }
  };

  useEffect(() => {
    let hash = window.location.hash;
    try {
      if (document.querySelector(hash)) {
        document?.querySelector(hash)?.scrollIntoView(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    myAxios
      .get("/collection/all")
      .then((response) => {
        if (response.status === 200) {
          console.log("response.data.message", response.data.message);

          setCollections(response.data.message);
        } else {
          console.log(response.data.message);
          setCollections([]);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoadingCollections(false));
  }, []);

  useEffect(() => {
    myAxios
      .get("/goodies/hot-goodies")
      .then((response) => {
        if (response.status === 200) {
          console.log("response.data.message", response.data.message);

          setTrendingGoodies(response.data.message);
        } else {
          setTrendingGoodies([]);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoadingTrendingGoodies(false));
  }, []);

  useEffect(() => {
    myAxios
      .get("/goodies/new-goodies")
      .then((response) => {
        if (response.status === 200) {
          console.log("response.data.message", response.data.message);

          setNewGoodies(response.data.message);
          console.log("Voici les nouveaux goodie", response.data.message);
        } else {
          console.log("Voici les nouveaux goodie", response.data.message);
          setNewGoodies([]);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoadingNewGoodies(false));
  }, []);

  useEffect(() => {
    myAxios
      .get("/hero/all")
      .then((response) => {
        if (response.status === 201) {
          setHeroSection((prevState) => [
            ...prevState,
            ...response.data.message,
          ]);
          console.log("hero",response.data.message);
        } else {
          console.log("hero",response.data.message);
          setHeroSection((prevState) => [...prevState]);
        }
      })
      .catch((error) => console.log(error));
    // .finally(() => setIsLoadingHeroSection(false));
  }, []);

  useEffect(() => {
    if (heroSection.length > 1) {
      let id = setInterval(() => {
        let nextButton =
          document.querySelector<HTMLElement>("#next-hero-image");

        if (nextButton) {
          nextButton.click();
        }
      }, 6500);
      return () => {
        clearInterval(id);
      };
    }
  }, [heroSection]);

  useEffect(() => {
    try {
      let hash = window.location.hash;
      if (!hash) {
        scrollToTop();
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Box id="home-container">
      <Box paddingX={match1000 ? "5%" : 12} className="hero-section-wrapper">
        <Grid container className="hero-section">
          <Grid
            item
            xs={12}
            md={6}
            className="text-side animate__animated animate__backInLeft"
          >
            <Typography
              className="green-text"
              component={"span"}
              style={{ fontSize: match900 ? "12px" : "14px" }}
            >
              La premiere boutique dedié aux amoureux de la Tech #TT237{" "}
            </Typography>
            <Typography
              className="hero-title"
              component={"h2"}
              variant="h2"
              style={{
                fontSize: match900 ? "40px" : "50px",
                lineHeight: match900 ? "60px" : "68px",
              }}
            >
              EXPRIME TA PASSION POUR LA TECH_
            </Typography>
            <Typography
              className="hero-text"
              component={"div"}
              variant={match900 ? "body2" : "body1"}
            >
              Sois fière d'être passionné💙!
              <br />
              <i>
                <b
                  style={{
                    fontSize: "14px",
                  }}
                >
                  {match900 ? (
                    <span>
                      #Etre Developpeur Plus Qu'un Metier C'est Un Style De Vie
                    </span>
                  ) : (
                    <span>
                      #EtreDeveloppeurPlusQu'unMetierC'estUnStyleDeVie
                    </span>
                  )}{" "}
                  #devStyle #devAttitude
                </b>
              </i>
            </Typography>
            <Button className="hero-button">
              <a
                href="#our-collections-section"
                style={{ textDecoration: "none", color: "white" }}
              >
                npm start shopping
              </a>
            </Button>
            <Box
              className="social-container"
              display={"flex"}
              justifyContent={"space-between"}
            >
              <a
                target="_blank"
                onClick={() => {
                  // analyticsEventTracker("SOCIAL")("twitter");
                }}
                rel="noopener noreferrer"
                href="https://twitter.com/_devstyle"
              >
                <Box
                  position={"relative"}
                  style={{ height: "24px", width: "24px" }}
                >
                  <Image
                    src={"/assets/icons/twitter.png"}
                    alt="devstyle twitter icon"
                    fill={true}
                    objectFit="contain"
                  />
                </Box>
              </a>
              <a
                target="_blank"
                onClick={() => {
                  // analyticsEventTracker("SOCIAL")("twitter");
                }}
                rel="noopener noreferrer"
                href="https://www.linkedin.com/company/devstyle"
              >
                <Box
                  position={"relative"}
                  style={{ height: "24px", width: "24px" }}
                >
                  <Image
                    src={"/assets/icons/linkedin.png"}
                    alt="devstyle linkedin icon"
                    fill={true}
                    objectFit="contain"
                  />
                </Box>
              </a>
              <a
                target="_blank"
                onClick={() => {
                  // analyticsEventTracker("SOCIAL")("whatsapp");
                }}
                rel="noopener noreferrer"
                href="https://api.whatsapp.com/send/?phone=237692650993&text=Hello _DevStyle"
              >
                <Box
                  position={"relative"}
                  style={{ height: "24px", width: "24px" }}
                >
                  <Image
                    src={"/assets/icons/whatsapp.png"}
                    alt="devstyle whatsapp icon"
                    fill={true}
                    objectFit="contain"
                  />
                </Box>
              </a>
              <a
                target="_blank"
                onClick={() => {
                  // analyticsEventTracker("SOCIAL")("facebook");
                }}
                rel="noopener noreferrer"
                href="https://www.facebook.com/devstyl"
              >
                <Box
                  position={"relative"}
                  style={{ height: "24px", width: "24px" }}
                >
                  <Image
                    src={"/assets/icons/facebook.png"}
                    alt="devstyle facebook icon"
                    fill={true}
                    objectFit="contain"
                  />
                </Box>
              </a>
              <a
                target="_blank"
                onClick={() => {
                  // analyticsEventTracker("SOCIAL")("tiktok");
                }}
                rel="noopener noreferrer"
                href="https://www.tiktok.com/@_devstyle"
              >
                <Box
                  position={"relative"}
                  style={{ height: "24px", width: "24px" }}
                >
                  <Image
                    src={"/assets/icons/tiktok.png"}
                    alt="devstyle tiktok icon"
                    fill={true}
                    objectFit="contain"
                  />
                </Box>
              </a>
              <a
                target="_blank"
                onClick={() => {
                  // analyticsEventTracker("SOCIAL")("instagram");
                }}
                rel="noopener noreferrer"
                href="https://www.instagram.com/_devstyle/"
              >
                <Box
                  position={"relative"}
                  style={{ height: "24px", width: "24px" }}
                >
                  <Image
                    src={"/assets/icons/insta.png"}
                    alt="devstyle instagram icon"
                    fill={true}
                    objectFit="contain"
                  />
                </Box>
              </a>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} className="image-side">
            {/* Hero section here  */}

            {heroSection.length < 1 ? (
              <Box
                height={"100%"}
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Spinner size={100} thickness={10} color={"#220f0055"} />
              </Box>
            ) : (
              <Box
                className="animate__animated animate__jackInTheBox  animate__delay-1s"
                style={{
                  alignSelf: match900 ? "center" : "flex-end",
                }}
              >
                {/*eslint-disable-next-line @next/next/no-img-element*/}
                <img
                  id="hero-image"
                  className="animate__faster"
                  src={heroSection[heroImageIndex].image.url
                  }
                  alt="devstyle hero"
                  style={{
                    margin: match900 ? "auto" : "0 0 0 auto",
                    width: match900 ? "100%" : "65%",
                  }}
                />

                {heroSection.length > 1 && (
                  <Box className="icons-container">
                    <IconButton onClick={() => handleHeroImageChange("back")}>
                      <Image
                        id="back-hero-image"
                        src={"/assets/icons/arrow.png"}
                        alt="backward icon"
                        className="backward-icon"
                        width={20}
                        height={20}
                      />
                    </IconButton>
                    <IconButton onClick={() => handleHeroImageChange("next")}>
                      <Image
                        id="next-hero-image"
                        src={"/assets/icons/arrow.png"}
                        alt="forward icon"
                        className="forward-icon"
                        width={20}
                        height={20}
                      />
                    </IconButton>
                  </Box>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
      <Box
        id="our-collections-section"
        className="our-collections-section"
        paddingX={match1000 ? 0 : 12}
        paddingY={12}
      >
        <Box className="title-container">
          <Typography
            className="title"
            style={{ fontSize: match900 ? "30px" : "36px" }}
            component={"span"}
          >
            Nos
          </Typography>
          &nbsp; &nbsp;
          <Box position={"relative"}>
            <Typography
              className="title"
              style={{ fontSize: match900 ? "30px" : "36px" }}
              component={"span"}
            >
              Collections
            </Typography>
            <hr
              style={{
                height: "6px",
                width: "100%",
                borderWidth: "0",
                color: "#05A660",
                backgroundColor: "#05A660",
                borderRadius: "20px",
                position: "absolute",
              }}
            />
          </Box>
          <Box
            position={"relative"}
            style={{
              height: "40px",
              width: "40px",
            }}
          >
            <Image
              src={"/assets/icons/shopping-bag.png"}
              alt="shopping bag icon"
              fill={true}
              objectFit="contain"
            />
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={match1000 ? 0 : 1}
            className="collections-wrapper"
          >
            {isLoadingCollections ? (
              <>
                <Grid item xs={12} lg={6}>
                  <Skeleton
                    variant="rectangular"
                    height={600}
                    width={"100%"}
                    animation="wave"
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <Skeleton
                    variant="rectangular"
                    height={600}
                    width={"100%"}
                    animation="wave"
                  />
                </Grid>
              </>
            ) : collections.length <= 0 ? (
              <Typography
                style={{
                  fontStyle: "italic",
                  width: "100%",
                  textAlign: "center",
                  margin: "25px 0px",
                  fontSize: "22px",
                  fontWeight: "bold",
                }}
              >
                Vide
              </Typography>
            ) : (
              collections.map((collection, i) => (
                <Grid
                  item
                  xs={12}
                  lg={i === collections.length - 1 ? 12 : 6}
                  key={i + "" + collection._id}
                >
                  {i === collections.length - 1 ? (
                    <Grid
                      container
                      style={{
                        background: `linear-gradient(90deg, ${
                          collection.colors.split("-")[0]
                        } 0%, ${collection.colors.split("-")[1]} 100%)`,
                        cursor: "default",
                      }}
                      className={`collection-item animate__animated ${
                        i % 2 === 0
                          ? "animate__fadeInLeft"
                          : "animate__fadeInRight"
                      }`}
                    >
                      <Grid
                        item
                        xs={10}
                        paddingX={
                          i === collections.length - 1 && !match1000 ? 10 : 4
                        }
                        justifyItems={"center"}
                        alignContent={"center"}
                        zIndex={3}
                        className="collection-text-container"
                      >
                        <Typography
                          className={`collection-item-title  
                            ${
                            i === collections.length - 1 && !match1000
                              ? "large"
                              :
                              ""
                            }`}
                          component={"h2"}
                        >
                          {collection.title.split(" ")[0]} {collection.title.split(" ")[1]} <br />
                          {collection.title.split(" ")[2]}
                        </Typography>
                        <Button 
                          className={`button ${
                            i === collections.length - 1 && !match1000
                              ? "large"
                              : ""
                          }`}
                          disabled={true}
                        >
                          Coming Soon⏳
                        </Button>
                      </Grid>
                      <Grid item xs={2} className="collection-image-container">
                        {/*eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="collection-image"
                          src={collection.image.url}
                          alt={collection.title + " image"}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <Link
                      href={`/collection/${collection.slug}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Grid
                        container
                        style={{
                          background: `linear-gradient(90deg, ${
                            collection.colors.split("-")[0]
                          } 0%, ${collection.colors.split("-")[1]} 100%)`,
                        }}
                        className={`collection-item animate__animated ${
                          i % 2 === 0
                            ? "animate__fadeInLeft"
                            : "animate__fadeInRight"
                        }`}
                      >
                        <Grid
                          item
                          xs={10}
                          paddingX={4}
                          justifyItems={"center"}
                          alignContent={"center"}
                          zIndex={3}
                          className="collection-text-container"
                        >
                          <Typography
                            className="collection-item-title"
                            component={"h2"}
                          >
                            {collection.title}
                          </Typography>
                          <Button
                            className="button"
                          >
                            this.shop.now()
                          </Button>
                        </Grid>
                        <Grid item xs={2} className="collection-image-container">
                          {/*eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="collection-image"
                            src={collection.image.url}
                            alt={collection.title + " image"}
                          />
                        </Grid>
                      </Grid>
                    </Link>
                  )}
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Box>
      <Box
        className="goodies-listing-section"
        paddingX={match1000 ? "10%" : 12}
        paddingY={12}
      >
        <Box className="title-container" style={{ fontSize: "16px" }}>
          <Box position={"relative"}>
            <Typography
              className="title"
              style={{ fontSize: match900 ? "30px" : "36px" }}
              component={"span"}
            >
              Nouveaux
            </Typography>
            <hr
              style={{
                height: "6px",
                width: "100%",
                borderWidth: "0",
                color: "#ff3b3b",
                backgroundColor: "#ff3b3b",
                borderRadius: "20px",
                position: "absolute",
              }}
            />
          </Box>
          &nbsp; &nbsp;
          <Typography
            className="title"
            style={{ fontSize: match900 ? "30px" : "36px" }}
            component={"span"}
          >
            et Chauds
          </Typography>
          <Box
            position={"relative"}
            style={{
              height: "40px",
              width: "40px",
            }}
          >
            <Image
              src={"/assets/icons/hot.png"}
              alt="hot icon"
              fill={true}
              objectFit="contain"
            />
          </Box>
        </Box>

        <Box className="goodies-container" marginY={8}>
          <Grid container spacing={5}>
            {isLoadingNewGoodies ? (
              <>
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <GoodieCardSkeleton />
                </Grid>
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <GoodieCardSkeleton />
                </Grid>
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <GoodieCardSkeleton />
                </Grid>
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <GoodieCardSkeleton />
                </Grid>
              </>
            ) : newGoodies.length <= 0 ? (
              <Typography
                style={{
                  fontStyle: "italic",
                  width: "100%",
                  textAlign: "center",
                  margin: "25px 0px",
                  fontSize: "22px",
                  fontWeight: "bold",
                }}
              >
                Vide
              </Typography>
            ) : (
              newGoodies.map((goodie, i) => (
                <Grid
                  key={i + " " + goodie._id}
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <GoodieCard {...goodie} />
                </Grid>
              ))
            )}
          </Grid>
        </Box>
        <br />
        <br />
        <br />
        <Box className="title-container" style={{ fontSize: "16px" }}>
          <Typography
            className="title"
            style={{ fontSize: match900 ? "30px" : "36px" }}
            component={"span"}
          >
            En
          </Typography>
          &nbsp; &nbsp;
          <Box position={"relative"}>
            <Typography
              className="title"
              style={{ fontSize: match900 ? "30px" : "36px" }}
              component={"span"}
            >
              Tendances
            </Typography>
            <hr
              style={{
                height: "6px",
                width: "100%",
                borderWidth: "0",
                color: "#0063F7",
                backgroundColor: "#0063F7",
                borderRadius: "20px",
                position: "absolute",
              }}
            />
          </Box>
          <Box
            position={"relative"}
            style={{
              height: "40px",
              width: "40px",
            }}
          >
            <Image
              src={"/assets/icons/rocket.png"}
              alt="rocket icon"
              fill={true}
              objectFit="contain"
            />
          </Box>
        </Box>
        <Box className="goodies-container" marginY={8}>
          <Grid container spacing={5}>
            {isLoadingTrendingGoodies ? (
              <>
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <GoodieCardSkeleton />
                </Grid>
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <GoodieCardSkeleton />
                </Grid>
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <GoodieCardSkeleton />
                </Grid>
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <GoodieCardSkeleton />
                </Grid>
              </>
            ) : trendingGoodies.length <= 0 ? (
              <Typography
                style={{
                  fontStyle: "italic",
                  width: "100%",
                  textAlign: "center",
                  margin: "25px 0px",
                  fontSize: "22px",
                  fontWeight: "bold",
                }}
              >
                Vide
              </Typography>
            ) : (
              trendingGoodies.map((goodie, i) => (
                <Grid
                  key={i + " " + goodie._id}
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <GoodieCard {...goodie} />
                </Grid>
              ))
            )}
          </Grid>
        </Box>
        <br />
        <Box display={"flex"} justifyContent={"center"}>
          <Link
            href={"/collection/all-goodies"}
            style={{ textDecoration: "none" }}
          >
            <Button className="button">
              Voir tous nos goodies{" "}
              <Image
                src={"/assets/icons/arrow-white.png"}
                alt="arrow icon"
                width={20}
                height={20}
                style={{ marginLeft: "7px" }}
              />
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
