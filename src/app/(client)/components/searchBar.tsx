"use client";

import {
  Box,
  InputBase,
  IconButton,
  Modal,
  Fade,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import "./searchBar.scss";
import SearchIcon from "@mui/icons-material/Search";
import { ChangeEvent, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ICollectionForCart, IGoodie } from "@/app/lib/interfaces";
import { stripHtmlTags } from "../lib/utils-script";

interface ISearchBar {
  collections: ICollectionForCart[] | null;
}

const SearchBar = ({ goodies }: any) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("here is the goodies", goodies)
    if (inputValue) {



      const filteredSuggestions =
        goodies
          ?.filter((goodie: IGoodie) => {

            const descriptionText = stripHtmlTags(goodie.description)


            return (goodie.name.toLowerCase().includes(inputValue.toLowerCase()) || descriptionText.toLowerCase().includes(inputValue.toLowerCase()))



          }
          )
          .map((goodie: IGoodie) => goodie.name) || [];



      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, goodies]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.suggestions-list')) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setInputValue("");
  };

  const searchProduct = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = (searchTerm: string = inputValue) => {
    if (searchTerm) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }

    handleClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSearch(suggestion);
  };

  return (
    <>
      <Box className="search-icon cursor-pointer" onClick={handleOpen}>
        <SearchIcon />
      </Box>

      <Modal
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        className="search-modal"
      >
        <Fade in={isOpen}>
          <Box
            className="search-container"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              height: "100%",
              paddingTop: "20vh",
            }}
          >
            <Box
              ref={searchContainerRef}
              className="search-bar"
              sx={{
                width: "80%",
                maxWidth: "600px",
                backgroundColor: "white",
                borderRadius: "30px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                padding: "3px  5px",
              }}
            >
              <InputBase
                placeholder="Rechercher des produits"
                value={inputValue}
                onChange={searchProduct}
                onKeyPress={handleKeyPress}
                fullWidth
                autoFocus
                sx={{
                  ml: 2,
                  flex: 1,
                  "& input": {
                    padding: "10px 0",
                  },
                }}
              />
              <button
                onClick={() => handleSearch()}
                className=" text-white bg-[#220f00] p-2 rounded-full"
              >
                <SearchIcon />
              </button>
            </Box>
            {suggestions.length > 0 && (
              <List
                className="suggestions-list"
                sx={{
                  width: "80%",
                  maxWidth: "600px",
                  mt: 2,
                  backgroundColor: "white",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <ListItemText primary={suggestion} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default SearchBar;
