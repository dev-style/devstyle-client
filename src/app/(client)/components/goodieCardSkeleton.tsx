import React from "react";
import { Box, Skeleton } from "@mui/material";

const GoodieCardSkeleton = ({search}: {search?: boolean}) => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
      sx={{
       
        ...(search && {
          height: "395px",
          width: "285px"
        })
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={325}
        width={285}
      />
      <Skeleton variant="text" animation="wave" height={30} width={"60%"} />
      <Skeleton variant="text" animation="wave" height={40} width={"40%"} />
    </Box>
  );
};

export default GoodieCardSkeleton;
