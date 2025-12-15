"use client";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import AmbassadorCardSkeleton from "@/app/(client)/components/ambassadorCardSkeleton";

import myAxios from "@/app/(client)/lib/axios.config";
import { IAmbassador } from "@/app/lib/interfaces";

import "./styles.scss";
import Image from "next/image";

function AmbassadorsListing() {
  const [isLoadingAmbassadors, setIsLoadingAmbassadors] = useState(true);
  const [ambassadors, setAmbassadors] = useState<IAmbassador[]>([]);

  useEffect(() => {
    myAxios
      .get("/ambassador/all")
      .then((response) => {
        if (response.status === 200) {
          setAmbassadors(response.data.message);
        } else {
          // console.log(response.data.message);
          setAmbassadors([]);
        }
      })
      .catch((error) => {
        // console.log(error)
      })
      .finally(() => setIsLoadingAmbassadors(false));
  }, []);
  return (
    <Box className="ambassadors-listing" marginTop={15} marginBottom={8}>
      <Grid container spacing={5}>
        {isLoadingAmbassadors ? (
          <>
            {[1, 2, 3, 4].map((index) => (
              <Grid key={index} item xs={12} md={6} lg={4} xl={3}>
                <AmbassadorCardSkeleton />
              </Grid>
            ))}
          </>
        ) : ambassadors.length <= 0 ? (
          <Typography
            style={{
              width: "100%",
              textAlign: "center",
              margin: "25px 0px",
              fontSize: "40px",
              fontWeight: "bold",
            }}
          >
            Coming SOON !💜⌛
          </Typography>
        ) : (
          ambassadors.map((ambassador, i) => (
            <Grid
              key={i + " " + ambassador._id}
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
              <Box className="ambassador-card">
                <Box
                  className="ambassador-card-top  animate__animated animate__fadeIn"
                  style={{
                    background: `linear-gradient(147.14deg, ${
                      ambassador.colors.split("-")[0]
                    } 6.95%, ${ambassador.colors.split("-")[1]} 93.05%)`,
                  }}
                >
                  <Image
                    src={ambassador.image.url}
                    alt={ambassador.name}
                    width={500}
                    height={500}
                  />
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  flexDirection={"column"}
                  alignItems={"center"}
                >
                  <Typography className="name">{ambassador.name}</Typography>
                  {ambassador.social.map((social, i) => (
                    <a
                      key={i}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={`/social/${social._id}.png`}
                        alt={social.name}
                        width={50}
                        height={50}
                      />
                    </a>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

export default AmbassadorsListing;
