"use client";

import {
  Box,
  Typography,
  TextField,
  Grid,
  useMediaQuery,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import myAxios from "../../lib/axios.config";
import { toast } from "react-toastify";
import GoodieCardSkeleton from "../../components/goodieCardSkeleton";
import GoodieCard from "../../components/goodieCard";
import { IGoodie } from "@/app/lib/interfaces";
import { useSearchParams } from "next/navigation";

type Props = {};

const SearchPage = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [goodies, setGoodies] = useState<IGoodie[]>([]);
  const [filteredGoodies, setFilteredGoodies] = useState<IGoodie[]>([]);
  const [isLoadingGoodies, setIsLoadingGoodies] = useState(true);
  const [sortValue, setSortValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tout");
  const match1000 = useMediaQuery("(max-width:1000px)");
  const searchParams = useSearchParams();

  useEffect(() => {
    myAxios
      .get("/goodie/search/all")
      .then((response) => {
        if (response.status === 200) {
          setGoodies(response.data.message);
          setFilteredGoodies(response.data.message);
          console.log("goodies", response.data.message);
          setIsLoadingGoodies(false);
        } else {
          console.log(response.data.message);
          setIsLoadingGoodies(false);
        }
      })
      .catch((error) => {
        toast.error(<div style={{ color: "#fff" }}>{error.message}</div>, {
          icon: "🌐",
          style: { textAlign: "center" },
        });
        console.log(error);
      });
  }, []);

  const filterCategories = useMemo(() => {
    const categories = new Set(goodies.map(goodie => goodie.fromCollection?.title));
    return ["Tout", ...Array.from(categories)];
  }, [goodies]);

  useEffect(() => {
    const query = searchParams.get("q");
    console.log("search query", query);

    let filtered = goodies;

    if (query) {
      filtered = filtered.filter((goodie) =>
        goodie.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (activeFilter !== "Tout") {
      filtered = filtered.filter(
        (goodie) => goodie.fromCollection?.title === activeFilter
      );
    }

    console.log("filtered goodie", filtered);

    setFilteredGoodies(filtered);
  }, [searchParams, goodies, activeFilter]);

  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setSortValue(value);
    let sorted = [...filteredGoodies];
    switch (value) {
      case "price_asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    setFilteredGoodies(sorted);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <Box
      paddingX={match1000 ? "5%" : 12}
      marginTop={match1000 ? "80px" : "60px"}
      marginBottom={match1000 ? "80px" : "60px"}
      sx={{ width: "100%", maxWidth: "100%", height: "auto" }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Box sx={{ backgroundColor: "" }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{
                fontWeight: "bold",
                fontSize: "14px",
                color: "#220f00",
                width: "100%",
              }}
            >
              Resultats
            </Typography>
            <Typography
              variant="h1"
              paragraph
              sx={{
                fontSize: "34px",
                color: "#220f00",
                fontWeight: "500",
                width: "100%",
              }}
            >
              {searchParams.get("q") || "Tous les produits"}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "",
              marginBottom: "20px",
            }}
          >
            <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {filterCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleFilterChange(category)}
                  style={{
                    backgroundColor: activeFilter === category ? "#220f00" : "#fff",
                    color: activeFilter === category ? "#fff" : "#220f00",
                    border: "1px solid #220f00",
                    padding: "8px 16px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    transition: "background-color 0.3s, color 0.3s",
                  }}
                >
                  {category}
                </button>
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Typography variant="subtitle1">Trier par</Typography>
              <Select
                value={sortValue}
                onChange={handleSortChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                size="small"
                sx={{ minWidth: 120, height: "32px" }}
              >
                <MenuItem value="">
                  <em>Aucun</em>
                </MenuItem>
                <MenuItem value="price_asc">Prix croissant</MenuItem>
                <MenuItem value="price_desc">Prix décroissant</MenuItem>
                <MenuItem value="name_asc">Nom A-Z</MenuItem>
                <MenuItem value="name_desc">Nom Z-A</MenuItem>
              </Select>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            gap: "10px",
          }}
        >
          {isLoadingGoodies ? (
            Array.from(new Array(8)).map((_, index) => (
              <Grid item sx={{ gap: "" }} key={index}>
                <GoodieCardSkeleton search={true} />
              </Grid>
            ))
          ) : filteredGoodies.length <= 0 ? (
            <Grid item xs={12}>
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
            </Grid>
          ) : (
            filteredGoodies.map((goodie, i) => (
              <Box key={goodie._id || i}>
                <GoodieCard {...goodie} />
              </Box>
            ))
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchPage;
