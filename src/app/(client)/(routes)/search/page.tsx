"use client";

import {
  Box,
  Typography,
  Grid,
  useMediaQuery,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import myAxios from "../../lib/axios.config";
import { toast } from "react-toastify";
import GoodieCardSkeleton from "../../components/goodieCardSkeleton";
import GoodieCard from "../../components/goodieCard";
import { IGoodie } from "@/app/lib/interfaces";
import { useSearchParams } from "next/navigation";

const SearchPage = () => {
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
          setIsLoadingGoodies(false);
        } else {
          console.error(response.data.message);
          setIsLoadingGoodies(false);
        }
      })
      .catch((error) => {
        toast.error(error.message, {
          icon: "🌐",
          style: { textAlign: "left", color: "#fff" },
        });
        console.error(error);
      });
  }, []);

  const filterCategories = useMemo(() => {
    const categories = new Set(goodies.map(goodie => goodie.fromCollection?.title));
    return ["Tout", ...Array.from(categories)];
  }, [goodies]);

  useEffect(() => {
    const query = searchParams.get("q");
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

    setFilteredGoodies(filtered);
  }, [searchParams, goodies, activeFilter]);

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
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
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: "bold", fontSize: "14px", color: "#220f00" }}>
            Resultats
          </Typography>
          <Typography variant="h1" paragraph sx={{ fontSize: { xs: "24px", sm: "28px", md: "34px" }, color: "#220f00", fontWeight: "500" }}>
            {searchParams.get("q") || "Tous les produits"}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", marginBottom: "20px", gap: "20px" }}>
            <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: { xs: "center", sm: "flex-start" } }}>
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
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: { xs: "center", sm: "flex-end" } }}>
              <Typography variant="subtitle1" sx={{ whiteSpace: "nowrap" }}>Trier par</Typography>
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
        <Grid item xs={12}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {isLoadingGoodies ? (
              Array.from(new Array(8)).map((_, index) => (
                <GoodieCardSkeleton key={index} search={true} />
              ))
            ) : filteredGoodies.length === 0 ? (
              <Typography sx={{ fontStyle: "italic", width: "100%", margin: "25px 0", fontSize: "22px", fontWeight: "bold" }}>
                Aucun résultat trouvé
              </Typography>
            ) : (
              filteredGoodies.map((goodie) => (
                <GoodieCard key={goodie._id} {...goodie} />
              ))
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchPage;
