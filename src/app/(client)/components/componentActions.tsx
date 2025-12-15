"use client";
import React, { useState, useEffect } from "react";
import { Box, Tooltip } from "@mui/material";
import Image from "next/image";

import { toast } from "react-toastify";
import { IPartner } from "@/app/lib/interfaces";
import myAxios from "@/app/(client)/lib/axios.config";

import Spinner from "./spinner";

export const ListPartners = () => {
  const [isLoadingPartners, setIsLoadingPartners] = useState(true);
  const [partners, setPartners] = useState<IPartner[]>([]);
  useEffect(() => {
    myAxios
      .get("/partner/all")
      .then((response) => {
        if (response.status === 200) {
          setPartners(response.data.message);
        } else {
          // console.log(response.data.message);
          setPartners([]);
        }
      })
      .catch((error) => {
        toast.error(<div style={{ color: "#fff" }}>{error.message}</div>, {
          icon: "🌐",
          style: { textAlign: "center" },
        });
        // console.log(error);
      })
      .finally(() => setIsLoadingPartners(false));
  }, []);

  return isLoadingPartners ? (
    <Box className="footer-links-wrapper">
      <Spinner size={25} thickness={3} color={"white"} />
    </Box>
  ) : (
    <Box className="footer-links-wrapper" style={{ flexDirection: "row" }}>
      {partners.map((partner, index) => (
        <a
          key={index + "-" + partner._id}
          href={partner.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ margin: "0 15px 15px 0" }}
        >
          <Tooltip title={partner.name}>
            <Box
              style={{ position: "relative", height: "50px", width: "80px" }}
            >
              <Image
                src={partner.logoWhite.url}
                alt={partner.name}
                objectFit="contain"
                fill={true}
              />
            </Box>
          </Tooltip>
        </a>
      ))}
    </Box>
  );
};
