/* eslint-disable react/no-unescaped-entities */
import { Box, Typography, Grid } from "@mui/material";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Metadata } from "next";

import "./styles.scss";

const ScrollToTop = dynamic(() => import("@/app/(client)/lib/scrollToTop"), {
  ssr: false,
});
// import { analyticsEventTracker } from "@/app/(client)/lib/google-analytics";
export const metadata: Metadata = {
  title:
    "À propos de _DevStyle | La premiere boutique dedié aux amoureux de la Tech #TT237 Cameroun",
  description:
    "Tout comme vous nous sommes Developpeurs </> et passionnés de Tech💙 --- #ForDevelopersByDevelopers",
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
    title:
      "À propos de _DevStyle | La premiere boutique dedié aux amoureux de la Tech #TT237 Cameroun",
    description:
      "Tout comme vous nous sommes Developpeurs </> et passionnés de Tech💙 --- #ForDevelopersByDevelopers",
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: "https://dev-style.com/about-us",
    siteName: "_DevStyle",
    countryName: "Cameroun",
    images: [
      {
        url: "https://dev-style.com/assets/images/metadata/devstyle team.jpg",
        width: 1280,
        height: 720,
        alt: "À propos de _DevStyle",
      },
    ],
  },
  twitter: {
    site: "https://dev-style.com/about-us",
    creator: "@_devstyle",
    description:
      "Tout comme vous nous sommes Developpeurs </> et passionnés de Tech💙 --- #ForDevelopersByDevelopers",
    title:
      "À propos de _DevStyle | La premiere boutique dedié aux amoureux de la Tech #TT237 Cameroun",
    images: [
      {
        url: "https://dev-style.com/assets/images/metadata/devstyle team.jpg",
        width: 1280,
        height: 720,
        alt: "À propos de _DevStyle",
      },
    ],
    card: "summary_large_image",
  },
};

const About = () => {
  return (
    <Box className="about-wrapper">
      <ScrollToTop />
      <Box>
        <Box
          className="about-hero-section-wrapper"
          style={{
            background:
              "linear-gradient(147.14deg, #5B8DEF 6.95%, #0063F7 93.05%)",
          }}
          padding={10}
        >
          <Box className="about-hero-section-container">
            <Box>
              <Typography className="text animate__animated animate__flipInX ">
                {
                  "Tout comme vous nous sommes Developpeurs </> et passionnés de Tech"
                }
              </Typography>
              <Typography className="subtext animate__animated animate__fadeInUp animate_delay-5s animate__slower">
                #ForDevelopersByDevelopers
              </Typography>
            </Box>
            <Box className="image-container">
              <Image
                src={"/assets/images/about-hero.png"}
                alt="about hero"
                className="animate__animated animate__fadeInUp animate__delay-1s animate__fast"
                objectFit="contain"
                fill={true}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        className="abouts-info animate__animated animate__fadeIn"
        marginTop={2}
      >
        <Box
          style={{
            height: "100%",
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: "18px",
            lineHeight: "40px",
            textAlign: "center",
            width: "100%",
            maxWidth: "1400px",
          }}
        >
          <Box className="title-container">
            <Typography
              className="title"
              style={{ fontSize: "36px" }}
              component={"span"}
            >
              C’est quoi
            </Typography>
            &nbsp; &nbsp;
            <Box position={"relative"}>
              <Typography
                className="title"
                style={{ fontSize: "36px" }}
                component={"span"}
              >
                DevStyle?
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
          </Box>
          <Grid container flexWrap={"wrap-reverse"} width={"100%"}>
            <Grid item md={6} width={"100%"}>
              <Box width={"100%"}>
                <Box width={"100%"} height={"600px"} position={"relative"}>
                  <Image
                    src={"/assets/images/team.jpg"}
                    alt="team"
                    objectFit="contain"
                    fill={true}
                  />
                </Box>
                <Typography
                  style={{
                    fontSize: "14px",
                    textAlign: "center",
                    marginTop: "10px",
                  }}
                >
                  Brought to you by{" "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.linkedin.com/in/diepe-angelo/"
                  >
                    Ange Noubissie😉
                  </a>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.instagram.com/thze_gab/"
                  >
                    - Gabriel Wandja🎨
                  </a>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.linkedin.com/in/ronice-hermine-hoza-ndowo-810a10209/"
                  >
                    - Hoza Hermine📢
                  </a>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.linkedin.com/in/scott-sado-950579229/"
                  >
                    - Scott Sado🧑🏽‍💻
                  </a>
                </Typography>
              </Box>
            </Grid>
            <Grid item md={6}>
              <Box
                style={{
                  padding: "40px 40px 0 40px",
                  textAlign: "justify",
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "17px",
                  lineHeight: "40px",
                }}
              >
                De façon littérale DevStyle est composé de deux mots Dev et
                Style, Dev qui désigne les professionnels, passionnés et fans de
                Technologies ( <b>Techx</b> ) et Style qui désigne un mode de
                vie et une façon de s'exprimer via le vestimentaire. <br />
                <br /> DevStyle est une marque dont l'objectif premier est de
                concevoir des designs, des visuels et des slogans originaux,
                créatifs et fun, méticuleusement réalisés sur des vêtements et
                Accessoires pour vous distinguer et vous connecter à votre
                passion pour la technologie. Optez pour des vêtements tels que
                des T-shirts, des Hoodies, des Sweat-shirts ou encore des
                articles plus uniques tels que des Pochettes, des Casquettes,
                des Mugs, des Posters et des Stickers et bien plus qui reflètent
                et expriment pleinement votre passion pour la technologie💙.
                <br />
                <br />
              </Box>
            </Grid>
          </Grid>
          <Box className="roadmap">
            <Box>
              <q>
                <i style={{ fontWeight: 300 }}>
                  Nous espérons vivement que lorsque votre ou vos articles
                  favoris arriveront de la boutique, vous ressentirez le même
                  esprit d'originalité et d'euphorie que nous
                </i>
                🤗
              </q>
              <br />
              <br />
              Ensuite, DevStyle vise à construire{" "}
              <b>
                une communauté Techx solidaire, dynamique et fun partageant la
                même passion pour la technologie que vous, et par-dessus tout,
                nous visons à établir un écosystème dynamique pour les Techx. (Our North Star📌)
              </b>
              {/* , en mettant en œuvre les objectifs suivants:
              <br />
              <br />
              <span
                style={{
                  backgroundColor: "#a9eff2",
                  fontWeight: "bold",
                  padding: "10px",
                }}
              >
                Meets & Talks Events fréquentes,
              </span>
              <br />
              <br />
              nous croyons que l'organisation plus fréquente d'événements Meets
              & Talks dynamise l'écosystème Tech, donne la possibilité de
              s'informer sur les nouvelles technologies en vogue{" "}
              <span style={{ fontWeight: 600 }}>
                ( Software, Blockchain, Electronic, AI etc )
              </span>{" "}
              et d'apprendre des expériences des experts de notre communauté et
              surtout cela permettra de se créer un réseau de personnes
              partageant la même passion que vous, créant ainsi plus
              d'opportunités potentielles, plus d'idées, et qui sait, peut-être
              que cette idée pourrait aboutir à la prochaine Licorne ou pourquoi
              pas Hectocorne de notre Société !🚀.
              <br />
              <br />
              <span
                style={{
                  backgroundColor: "#a9eff2",
                  fontWeight: "bold",
                  padding: "10px",
                }}
              >
                Hackathons & Compétitions,
              </span>
              <br />
              <br />
              nous croyons également que les compétitions favorisent
              l'amélioration de la norme au sein d'une communauté. Nous aspirons
              à créer des compétitions qui donneront l'occasion aux
              programmeurs, développeurs et designers de tous niveaux de se
              tester et de se surpasser tout en concourant pour remporter des
              Prix prestigieux et, bien sûr, tout en s'amusant😉. En bonus,
              attendez de voir notre concept " Scavenger Hunt "👾 !
              <br />
              <br /> */}
              <br />
              <br />
              <span
                style={{
                  backgroundColor: "#a9eff2",
                  fontWeight: "bold",
                  padding: "10px",
                }}
              >
                Vous decouvrirez nos differents concepts à venir très bientôt...⌛
              </span>
              <br />
              <br />
              <br />
              <Box className="title-container">
                <Box position={"relative"}>
                  <Typography
                    className="title"
                    style={{ fontSize: "36px" }}
                    component={"span"}
                  >
                    Les piliers
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
                  style={{ fontSize: "36px" }}
                  component={"span"}
                >
                  de DevStyle
                </Typography>
              </Box>
            </Box>
            <br />
            <Grid container>
              <Grid
                item
                xs={12}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Box
                  position={"relative"}
                  style={{
                    width: "64px",
                    height: "64px",
                  }}
                >
                  <Image
                    src={"/assets/icons/globe.png"}
                    objectFit="contain"
                    fill={true}
                    alt="globe icon"
                  />
                </Box>
                <span style={{ fontWeight: 500 }}>Rassembler</span>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Box
                  position={"relative"}
                  style={{
                    width: "64px",
                    height: "64px",
                  }}
                >
                  <Image
                    src={"/assets/icons/account.png"}
                    alt="account icon"
                    objectFit="contain"
                    fill={true}
                  />
                </Box>
                <span style={{ fontWeight: 500 }}>Dynamiser</span>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Box
                  position={"relative"}
                  style={{
                    width: "64px",
                    height: "64px",
                  }}
                >
                  <Image
                    src={"/assets/icons/module.png"}
                    alt="module icon"
                    fill={true}
                    objectFit="contain"
                  />
                </Box>
                <span style={{ fontWeight: 500 }}>Édifier</span>
              </Grid>
            </Grid>
            <br />
            {/* <br />
            Rejoignez notre communauté{" "}
            <a
              href="https://discord.gg/Hgq6UZH5"
              target="_blank"
              rel="noopener noreferrer"
              //   onClick={() => {
              //     // analyticsEventTracker("SOCIAL")("discord");
              //   }}
            >
              Discord DevStyle
            </a>{" "}
            et échangez avec l'équipe et de nombreuses autres personnes qui 
            partagent la même passion à un niveau personnel.*/} Pour ne rien rater de nos actualités,
            n'oubliez pas de suivre nos comptes{" "}
            <a
              target="_blank"
              style ={{
                color: "#0070b6ff",
              }}
                // onClick={() => {
                //   analyticsEventTracker("SOCIAL")("twitter");
                // }}
              rel="noopener noreferrer"
              href="https://twitter.com/_devstyle"
            >
              Twitter
            </a>
            ,{" "}
            <a
              target="_blank"
              style ={{
                color: "#0070b6ff",
              }}
                // onClick={() => {
                //   analyticsEventTracker("SOCIAL")("linkedin");
                // }}
              rel="noopener noreferrer"
              href="https://www.linkedin.com/company/devstyle/"
            >
              LinkedIn
            </a>
            ,{" "}
            <a
              target="_blank"
              style ={{
                color: "#0070b6ff",
              }}
              rel="noopener noreferrer"
              // onClick = {() => {
              //   analyticsEventTracker("SOCIAL")("tiktok");
              // }}
              href="https://www.tiktok.com/@_devstyle"
            >
              TikTok
            </a>
            ,{" "}
            <a
              target="_blank"
              style ={{
                color: "#0070b6ff",
              }}
                // onClick={() => {
                //   analyticsEventTracker("SOCIAL")("instagram");
                // }}
              rel="noopener noreferrer"
              href="https://www.instagram.com/_devstyle/"
            >
              Instagram
            </a>{" "}
            et{" "}
            <a
              target="_blank"
              style ={{
                color: "#0070b6ff",
              }}
                // onClick={() => {
                //   analyticsEventTracker("SOCIAL")("facebook");
                // }}
              rel="noopener noreferrer"
              href="https://www.facebook.com/devstyl"
            >
              Facebook
            </a>{" "}
            pour ne rien rater de nos nouveautés et de ce qui se passe dans la
            TT237😉.
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default About;
