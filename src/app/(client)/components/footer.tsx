import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { ListPartners } from "./componentActions";

import "./footer.scss";
// import { analyticsEventTracker } from "../app";

const Footer = () => {
  return (
    <Box className="footer-wrapper" position={"relative"}>
      <Box paddingY={5} zIndex={2} className="">
        {/* please center the container of this grid */}

        <Grid container className="footer-container mx-auto max-w-screen-2xl w-full">
          <Grid item xs={12} lg={2} height={"100%"} position={"relative"} className="flex items-center justify-center" >
            <Image
              src={"/assets/images/devstyle-white-logo.png"}
              style={{ marginBottom: 40 }}
              alt="devstyle white logo"
              className="devstyle-logo"
              width={170}
              height={50}
            />
          </Grid>
          <Grid container item xs={12} lg={10} className="flex items-center justify-end">
            <Grid item xs={12} lg={4}>
              <Typography className="footer-title">Nos pages</Typography>
              <Box className="footer-links-wrapper">
                <Link href="/">Accueil</Link>
                <Link
                  href="/#our-collections-section"
                // onClick={() => {
                //   try {
                //     if (document.querySelector("#our-collections-section")) {
                //       document
                //         .querySelector("#our-collections-section")
                //         ?.scrollIntoView(true);
                //     }
                //   } catch (error) {
                //     console.log(error);
                //   }
                // }}
                >
                  Shop
                </Link>
                <Link href="/about-us">Qui sommes-Nous ?</Link>
                <Link href="/our-ambassadors">Nos Ambassadeurs</Link>
              </Box>
            </Grid>
            {/* <Grid item xs={12} lg={4}>
              <Typography className="footer-title">Nos partenaires</Typography>
              <ListPartners />
            </Grid> */}
            <Grid item xs={12} lg={4}>
              <Typography className="footer-title">Suivez nous</Typography>
              <Box className="footer-links-wrapper">
                <Box marginBottom={5} display={"flex"}>
                  <a
                    target="_blank"
                    // onClick={() => {
                    //   // analyticsEventTracker("SOCIAL")("twitter");
                    // }}
                    rel="noopener noreferrer"
                    href="https://twitter.com/_devstyle"
                  >
                    <Image
                      src={"/assets/icons/twitter-white.png"}
                      alt="devstyle twitter icon"
                      width={20}
                      height={20}
                    />
                  </a>
                  &nbsp; &nbsp;
                  <a
                    target="_blank"
                    // onClick={() => {
                    //   // analyticsEventTracker("SOCIAL")("twitter");
                    // }}
                    rel="noopener noreferrer"
                    href="https://www.linkedin.com/company/devstyle"
                  >
                    <Image
                      src={"/assets/icons/linkedin-white.png"}
                      alt="devstyle linkedin icon"
                      width={20}
                      height={20}
                    />
                  </a>
                  &nbsp; &nbsp;
                  <a
                    target="_blank"
                    // onClick={() => {
                    //   // analyticsEventTracker("SOCIAL")("whatsapp");
                    // }}
                    rel="noopener noreferrer"
                    href="https://api.whatsapp.com/send/?phone=237692650993&text=Hello _DevStyle"
                  >
                    <Image
                      src={"/assets/icons/whatsapp-white.png"}
                      alt="devstyle whatsapp icon"
                      width={20}
                      height={20}
                    />
                  </a>
                  &nbsp; &nbsp;
                  <a
                    target="_blank"
                    // onClick={() => {
                    //   // analyticsEventTracker("SOCIAL")("facebook");
                    // }}
                    rel="noopener noreferrer"
                    href="https://www.facebook.com/devstyl"
                  >
                    <Image
                      src={"/assets/icons/facebook-white.png"}
                      alt="devstyle facebook icon"
                      width={20}
                      height={20}
                    />
                  </a>
                  &nbsp; &nbsp;
                  <a
                    target="_blank"
                    // onClick={() => {
                    //   // analyticsEventTracker("SOCIAL")("instagram");
                    // }}
                    rel="noopener noreferrer"
                    href="https://www.instagram.com/_devstyle/"
                  >
                    <Image
                      src={"/assets/icons/insta-white.png"}
                      alt="devstyle instagram icon"
                      width={20}
                      height={20}
                    />
                  </a>
                  &nbsp; &nbsp;
                  <a
                    target="_blank"
                    // onClick={() => {
                    //   // analyticsEventTracker("SOCIAL")("tiktok");
                    // }}
                    rel="noopener noreferrer"
                    href="https://www.tiktok.com/@_devstyle"
                  >
                    <Image
                      src={"/assets/icons/tiktok-white.png"}
                      alt="devstyle tiktok icon"
                      width={20}
                      height={20}
                    />
                  </a>
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"flex-start"}
                  alignItems={"center"}
                  marginTop={1}
                >
                  <Image
                    src={"/assets/icons/phone-white.png"}
                    alt="devstyle phone icon"
                    width={20}
                    height={20}
                  />{" "}
                  &nbsp;&nbsp;
                  <Box>
                    <a
                      href="tel:+237692650993"
                    // onClick={() => {
                    //   // analyticsEventTracker("CONTACT")("Orange Number");
                    // }}
                    >
                      (+237) 692 650 993
                    </a>
                    <a
                      href="tel:+237654456264"
                    // onClick={() => {
                    //   // analyticsEventTracker("CONTACT")("Mtn Number");
                    // }}
                    >
                      {" "}
                      / 654 456 264
                    </a>
                  </Box>
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"flex-start"}
                  alignItems={"center"}
                  marginTop={1}
                >
                  <Image
                    src={"/assets/icons/email.png"}
                    alt="devstyle email icon"
                    width={20}
                    height={20}
                  />{" "}
                  &nbsp;&nbsp;
                  <a
                    href="mailto:contact.devstyle@gmail.com"
                  // onClick={() => {
                  //   // analyticsEventTracker("CONTACT")("Email");
                  // }}
                  >
                    contact.devstyle@gmail.com
                  </a>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box className="footer-copyright-text">
        Tous droits réservés © {new Date().getFullYear()}
      </Box>
      <Image
        src={"/assets/images/saly-footer.png"}
        alt="devstyle saly footer"
        className="footer-image"
        quality={100}
        width={295}
        height={0}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          zIndex: 1,
        }}
      />
    </Box>
  );
};

export default Footer;
