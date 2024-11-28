"use client";
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  useMediaQuery,
  ButtonBase,
  Skeleton,
  Tooltip,
  ClickAwayListener,
} from "@mui/material";
import {
  ThumbUpTwoTone,
  RemoveRedEyeOutlined,
  ShareOutlined,
  Check,
  FavoriteRounded,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import OrderModal from "@/app/(client)/components/orderModal";
import GoodieCardSkeleton from "@/app/(client)/components/goodieCardSkeleton";
import GoodieCard from "@/app/(client)/components/goodieCard";
import CartContext from "@/app/(client)/contexts/cart/cartContext";
import {
  IGoodie,
  IGoodieForCart,
  IGoodieSize,
  IUrl,
} from "@/app/lib/interfaces";

import {
  calculatePromoPrice,
  scrollToTop,
} from "@/app/(client)/lib/utils-script";
import myAxios from "@/app/(client)/lib/axios.config";
import "./styles.scss";
import Image from "next/image";
import Spinner from "@/app/(client)/components/spinner";
import PayementContainer from "@/app/(client)/components/PayementContainer";

const Goodie = (props: any) => {
  const { cartDispatch } = useContext(CartContext);
  const match700 = useMediaQuery("(max-width:700px)");
  const match900 = useMediaQuery("(max-width:900px)");
  const pathname = usePathname();
  const router = useRouter();

  const [isLoadingGoodie, setIsLoadingGoodie] = useState(true);
  const [isLoadingSomeCollectionGoodies, setIsLoadingSomeCollectionGoodies] =
    useState(true);
  const [someCollectionGoodies, setSomeCollectionGoodies] = useState<IGoodie[]>(
    []
  );
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [goodie, setGoodie] = useState<IGoodie>();
  const [modalOpen, setModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [userCountry, setUserCountry] = useState("");



  const changeMainImage = (image: IUrl) => {
    if (image.url) {
      setGoodie({ ...goodie, mainImage: image } as IGoodie);
    }
  };

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 0) {
      setGoodie({ ...goodie, quantity: newQty } as IGoodie);
    }
  };

  const handleSelectedColorChange = (color: string) => {
    if (color) {
      let colorIndex = goodie?.availableColors.findIndex(
        (_color) => _color === color
      );
      let correspondingImage = goodie?.images[colorIndex ?? 0];
      setGoodie({
        ...goodie,
        selectedColor: color,
        mainImage: correspondingImage,
      } as IGoodie);
    }
  };

  const handleSelectedSizeChange = (size: string) => {
    if (size) {
      setGoodie({ ...goodie, selectedSize: size } as IGoodie);
    }
  };

  useEffect(() => {
    myAxios
      .get("/goodie/" + props.slug)
      .then((response) => {
        console.log("Le goodieee", response.data);
        if (response.status === 200) {
          setGoodie({
            ...response.data.message,
            sizes: response.data.message.sizes.filter(
              (size: IGoodieSize) => size.size !== ""
            ),
            quantity: 1,
            selectedColor: response.data.message.availableColors[0],
            selectedSize:
              response.data.message.sizes[
                Math.floor(response.data.message.sizes?.length ?? 0) / 2
              ]?.size,
          });
          setIsLoadingGoodie(false);

          myAxios
            .get(
              `/goodies/hot-goodies/collection/${response.data.message.fromCollection._id}/${response.data.message._id}`
            )
            .then((response) => {
              if (response.status === 200) {
                setSomeCollectionGoodies([...response.data.message]);
                setIsLoadingSomeCollectionGoodies(false);
              } else {
                // console.log(response.data.message);
                setSomeCollectionGoodies([]);
                setIsLoadingSomeCollectionGoodies(false);
              }
            })
            .catch((error) => console.log("error", error));
        } else {
          console.log(response.data.message);
          setIsLoadingGoodie(false);
        }
      })
      .catch((error) => {
        toast.error(<div style={{ color: "#fff" }}>{error.message}</div>, {
          icon: "🌐",
          style: { textAlign: "center" },
        });
        console.log(error);
      });

    // Fetch user's country
    fetch(
      "https://api.ipgeolocation.io/ipgeo?apiKey=faf527222d2a46c8a4ba42da7d2ab1d8"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("country location", data);
        setUserCountry(data.country_name);
      })
      .catch((error) => {
        console.error("Error fetching country:", error);
        setUserCountry("Unknown"); // Set a default value in case of error
      });
  }, [props.slug]);

  useEffect(() => {
    myAxios
      .put("/goodie/update/views/" + props.slug)
      .then((response) => {
        if (response.status === 200) {
          // console.log(response.data.message);
        } else {
          // console.log(response.data.message);
        }
      })
      .catch((error) => console.log(error));
  }, [props.slug]);

  const generateCartDescription = () => {
    if (goodie?._id) {
      let text = `
*ID:* ${goodie?._id} ;
*Name:* ${goodie?.name} ;
*Link:* https://dev-style.com/goodie/${goodie?.slug} ;
*Collection:* ${goodie?.fromCollection.title} ;
*MainImage:* ${goodie?.mainImage.url} ;
*Color:* ${goodie?.selectedColor} ;
*Size:* ${goodie?.selectedSize} ;
*Quantity:* ${goodie?.quantity} ;
*Price:* ${goodie?.price} ;
*PromoPrice:* ${goodie?.inPromo
          ? calculatePromoPrice(goodie?.price, goodie?.promoPercentage)
          : "none"
        } ;
*PromoPercent:* ${goodie?.inPromo ? goodie?.promoPercentage : "none"} ;    
`;

      console.log("test message", text);

      return encodeURIComponent(text);
    }
    return "";
  };

  const getCartID = () => {
    let text = ` ${goodie?._id}-${goodie?.name}-${goodie?.fromCollection.title
      }-${goodie?.selectedColor}-${goodie?.selectedSize}-${goodie?.price}-${goodie?.inPromo
        ? calculatePromoPrice(goodie?.price, goodie?.promoPercentage)
        : "none"
      }`;
    return text;
  };

  const addToCartFromSellPage = () => {
    let cartID = getCartID();
    cartDispatch({
      type: "ADD_TO_CART",
      payload: { ...goodie, cartID: cartID } as IGoodieForCart,
    });
  };

  const share = () => {
    setIsCopied(true);
    navigator.clipboard.writeText("https://dev-style.com" + pathname);
  };

  const like = () => {
    setIsLiking(true);
    setHasLiked(false);
    myAxios
      .put("/goodie/update/likes/" + props.slug)
      .then((response) => {
        if (response.status === 200) {
          // console.log(response.data.message);
          setIsLiking(false);
          setHasLiked(true);
          setGoodie((g) => ({ ...g, likes: (g?.likes ?? 0) + 1 } as IGoodie));
        } else {
          setIsLiking(false);
          setHasLiked(false);
          // console.log(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(<div style={{ color: "#fff" }}>{error.message}</div>, {
          icon: "🌐",
          style: { textAlign: "center" },
        });
        console.log(error);
      });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    if (hasLiked) {
      setTimeout(() => {
        setHasLiked(false);
      }, 2500);
    }
  }, [hasLiked]);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2500);
    }
  }, [isCopied]);

  const propertiesToSelect = ["name", "price", "quantity", "total"];

  const goodies = [
    {
      name: goodie?.name,
      price: goodie?.price,
      quantity: goodie?.quantity,
      total: goodie ? (goodie.price || 0) * (goodie?.quantity || 0) : 0,
    },
  ];

  console.log(goodies);

  const handleOrderClick = () => {
    if (userCountry === "Cameroon") {
      // setModalOpen(true);
      const goodieData = JSON.stringify(goodies)
      const message = generateCartDescription()
      const messageData = JSON.stringify(message)

      localStorage.setItem("goodiesData", goodieData)
      localStorage.setItem("messageData", messageData)
      router.push("/goodie/payement", { scroll: false })

    } else {
      if (goodie?.etsy) {
        window.open(goodie.etsy, "_blank");
      } else {
        toast.error("Le lien Etsy n'est pas disponible pour ce produit.");
      }
    }
  };

  return (
    <React.Fragment>
      {!modalOpen ? <Box className="goodie-wrapper">
        <Box
          paddingX={match700 ? 3 : 12}
          paddingY={5}
          style={{ width: "100%", height: "100%" }}
        >
          <Grid container style={{ width: "100%", height: "100%" }}>
            <Grid
              item
              xs={12}
              lg={5}
              style={{
                display: "flex",
                height: "100%",
                justifyContent: "center",
                flexDirection: match700 ? "column-reverse" : "row",
              }}
            >
              <Box
                className="goodie-preview-wrapper"
                style={
                  match700
                    ? { display: "flex", marginTop: 25, flexWrap: "wrap" }
                    : {}
                }
              >
                {isLoadingGoodie ? (
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    height={72}
                    width={72}
                  />
                ) : (
                  goodie?.images.map((image, i) => (
                    <Box
                      key={"goodie-" + image.url + "-" + i}
                      className="goodie-preview-container"
                      style={{
                        backgroundColor: goodie?.backgroundColors[i],
                        marginBottom: match700 ? 5 : 20,
                        marginRight: match700 ? 20 : 0,
                        border:
                          image.url === goodie?.mainImage.url
                            ? "2px solid #000"
                            : "none",
                        borderRadius:
                          image.url === goodie?.mainImage.url ? "4px" : "none",
                        position: "relative",
                      }}
                      onClick={() => changeMainImage(image)}
                    >
                      <Image
                        src={image.url}
                        alt="goodie"
                        width={64}
                        height={30}
                      />
                    </Box>
                  ))
                )}
              </Box>
              {isLoadingGoodie ? (
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  height={600}
                  width={match700 ? "100%" : 500}
                  style={{ margin: match700 ? "0" : "0 25px" }}
                />
              ) : (
                <Box
                  className="goodie-image-wrapper"
                  style={
                    match700
                      ? {
                        backgroundColor:
                          goodie?.backgroundColors[
                          goodie?.images.findIndex(
                            (image) => image.url === goodie?.mainImage.url
                          )
                          ],
                        width: "100%",
                        margin: "0",
                      }
                      : {
                        backgroundColor:
                          goodie?.backgroundColors[
                          goodie?.images.findIndex(
                            (image) => image.url === goodie?.mainImage.url
                          )
                          ],
                        position: "relative",
                      }
                  }
                >
                  {goodie?.inPromo && (
                    <Box className="promotion-box">
                      -{goodie?.promoPercentage}%
                    </Box>
                  )}
                  <Box width={"100%"} height={"100%"} position={"relative"}>
                    <Image
                      src={goodie?.mainImage.url as string}
                      alt="goodie"
                      fill={true}
                      objectFit="contain"
                    />
                  </Box>
                </Box>
              )}
            </Grid>
            <Grid
              container
              item
              xs={12}
              lg={7}
              display={"flex"}
              justifyContent={"space-between"}
              className="goodie-description"
            >
              <Grid
                item
                xs={12}
                md={10}
                className="description"
                style={{ width: "100%" }}
              >
                <Box className="title">
                  <Typography className="text">
                    {isLoadingGoodie ? (
                      <Skeleton
                        animation="wave"
                        variant="text"
                        height={50}
                        width={"70%"}
                      />
                    ) : (
                      goodie?.name
                    )}
                  </Typography>
                  <a
                    href={"/collection/" + goodie?.fromCollection?.slug}
                    className="collection"
                  >
                    {isLoadingGoodie ? (
                      <Skeleton
                        animation="wave"
                        variant="text"
                        height={50}
                        width={"20%"}
                      />
                    ) : (
                      goodie?.fromCollection.title
                    )}
                  </a>
                </Box>
                <Box className="price">
                  <Typography className="price">
                    {isLoadingGoodie ? (
                      <Skeleton
                        animation="wave"
                        variant="text"
                        height={35}
                        width={100}
                      />
                    ) : goodie?.inPromo ? (
                      calculatePromoPrice(
                        goodie?.price,
                        goodie?.promoPercentage
                      )
                    ) : (
                      goodie?.price
                    )}{" "}
                    FCFA
                  </Typography>

                  <div
                    style={{
                      color: "#ff3b3b",
                      textDecoration: "line-through",
                    }}
                  >
                    {goodie?.inPromo && (
                      <Typography className="promotion">
                        {goodie?.price} FCFA
                      </Typography>
                    )}
                  </div>
                </Box>
                <Box className="quantity">
                  <Typography className="label">Quantité</Typography>
                  <TextField
                    variant="outlined"
                    size="small"
                    type={"number"}
                    style={{
                      width: "48px",
                      height: "48px",
                      textAlign: "center",
                    }}
                    value={goodie?.quantity}
                    onChange={(e) =>
                      handleQuantityChange(Number(e.target.value))
                    }
                  />
                </Box>
                {(isLoadingGoodie ||
                  (goodie?.availableColors.length ?? 0) > 0) && (
                    <Box className="colors">
                      <Typography className="label">
                        Disponible en couleur
                      </Typography>
                      <Box className="colors-wrapper">
                        {isLoadingGoodie ? (
                          <Skeleton
                            animation="wave"
                            variant="circular"
                            height={40}
                            width={40}
                          />
                        ) : (
                          goodie?.availableColors.map((color, i) => (
                            <ButtonBase
                              key={"color-" + color + "-" + i}
                              className="color"
                              style={{
                                boxShadow:
                                  goodie?.selectedColor === color
                                    ? "0px 4px 10px #06C27033"
                                    : "0px 4px 10px rgba(0, 0, 0, 0.15)",
                              }}
                              onClick={() => handleSelectedColorChange(color)}
                            >
                              <Box
                                style={{
                                  backgroundColor: color,
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "50%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  border:
                                    goodie?.selectedColor === color
                                      ? "2px solid #06C27033"
                                      : "",
                                }}
                              >
                                {goodie?.selectedColor === color && (
                                  <Check color="success" />
                                )}
                              </Box>
                            </ButtonBase>
                          ))
                        )}
                      </Box>
                    </Box>
                  )}
                {isLoadingGoodie ? (
                  <Box className="size">
                    <Typography className="label">
                      Selectionner votre taille
                    </Typography>
                    <Box className="size-wrapper">
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        height={40}
                        width={40}
                      />
                    </Box>
                  </Box>
                ) : (
                  (goodie?.sizes?.length ?? 0) > 0 && (
                    <Box className="size">
                      <Typography className="label">
                        Selectionner votre taille
                      </Typography>
                      <Box className="size-wrapper">
                        {goodie?.sizes.map((size, i) => (
                          <ButtonBase
                            key={i + " " + size.size}
                            className="button"
                            onClick={() => handleSelectedSizeChange(size.size)}
                          >
                            <button
                              key={"size-" + size._id + "-" + i}
                              style={
                                goodie?.selectedSize === size.size
                                  ? {
                                    color: "#06C270",
                                    borderColor: "#06C270",
                                  }
                                  : {}
                              }
                              className="button"
                            >
                              {size.size}
                            </button>
                          </ButtonBase>
                        ))}
                      </Box>
                    </Box>
                  )
                )}

                {isLoadingGoodie ? (
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    height={40}
                    width={100}
                  />
                ) : (
                  <Box className="description">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: goodie?.description || "",
                      }}
                    />
                  </Box>
                )}

                <Grid container spacing={match900 ? 0 : 1} className="buttons">
                  <Grid item xs={12} md={6} style={{ width: "100%" }}>
                    <Button
                      style={{ backgroundColor: "#220F00", color: "white" }}
                      disabled={isLoadingGoodie}
                      onClick={handleOrderClick}
                    >
                      Commander maintenant
                      {userCountry === "Cameroon" && (
                        <Image
                          src={"/assets/icons/whatsapp-green.png"}
                          alt="whatsapp devstyle"
                          width={18}
                          height={18}
                        />
                      )}
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6} style={{ width: "100%" }}>
                    <Button
                      disabled={isLoadingGoodie}
                      onClick={addToCartFromSellPage}
                    >
                      Ajouter au panier()
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                md={2}
                className="actions"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  height: "100%",
                  width: "auto",
                  minWidth: "80px",
                  margin: "25px 0",
                }}
              >
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  marginBottom={1}
                  justifyContent={"center"}
                >
                  <RemoveRedEyeOutlined />
                  <Typography className="text">
                    {isLoadingGoodie ? (
                      <Skeleton animation="wave" variant="text" />
                    ) : (
                      (goodie?.views ?? 0) + 1
                    )}{" "}
                    Vues
                  </Typography>
                </Box>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  marginBottom={1}
                  justifyContent={"center"}
                >
                  <FavoriteRounded color="primary" />
                  <Typography className="text">
                    {isLoadingGoodie ? (
                      <Skeleton animation="wave" variant="text" />
                    ) : (
                      goodie?.likes ?? 0
                    )}{" "}
                  </Typography>
                </Box>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  marginBottom={1}
                  justifyContent={"center"}
                >
                  <IconButton
                    style={{ color: "#3E7BFA" }}
                    onClick={() => like()}
                  >
                    <ThumbUpTwoTone style={{ color: "#3E7BFA" }} />
                  </IconButton>
                  <ClickAwayListener onClickAway={() => null}>
                    <Tooltip
                      PopperProps={{
                        disablePortal: true,
                      }}
                      onClose={() => setIsLiking(false)}
                      open={isLiking || hasLiked}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      title={
                        isLiking ? (
                          <Spinner size={12} color="#ffffff" thickness={1} />
                        ) : hasLiked ? (
                          "+1 ❤️"
                        ) : (
                          ""
                        )
                      }
                      arrow
                      placement="bottom"
                    >
                      <Typography className="text" style={{ color: "#3E7BFA" }}>
                        J'aime
                      </Typography>
                    </Tooltip>
                  </ClickAwayListener>
                </Box>
                <ClickAwayListener onClickAway={() => null}>
                  <Tooltip
                    PopperProps={{
                      disablePortal: true,
                    }}
                    onClose={() => setIsCopied(false)}
                    open={isCopied}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title="Copié dans le presse-papier"
                    arrow
                    placement="top"
                  >
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      marginTop={match900 ? "" : "auto"}
                    >
                      <IconButton onClick={() => share()}>
                        <ShareOutlined />
                      </IconButton>
                      <Typography className="text">Partager</Typography>
                    </Box>
                  </Tooltip>
                </ClickAwayListener>
              </Grid>
            </Grid>
          </Grid>
          <Box className="goodies-container">
            <Box
              className="title-container"
              style={
                match700
                  ? { paddingTop: "75px", justifyContent: "center" }
                  : { paddingTop: "100px" }
              }
            >
              <Typography
                className="title"
                style={{ fontSize: match900 ? "30px" : "36px" }}
                component={"span"}
              >
                Toujour dans
              </Typography>
              &nbsp; &nbsp;
              <Box position={"relative"}>
                <Typography
                  className="title"
                  style={{ fontSize: "30px" }}
                  component={"span"}
                >
                  {goodie?.fromCollection?.title}
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
            </Box>
            <Grid container spacing={5}>
              {isLoadingSomeCollectionGoodies ? (
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
              ) : (
                someCollectionGoodies
                  .filter((_goodie) => _goodie?._id !== goodie?._id)
                  .map((goodie, i) => (
                    <Grid
                      key={i + " " + goodie?._id}
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
        </Box>
      </Box> :

        <PayementContainer goodie={goodies} message={generateCartDescription} />
      }

      {/* <OrderModal
        goodie={goodies}
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        message={generateCartDescription}
      /> */}
    </React.Fragment>
  );
};

export default Goodie;
