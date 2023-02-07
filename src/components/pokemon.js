import { Fragment, useEffect, useState } from "react";
import React from "react";
import "./style.css";
import colors from "./typeColor/colors";
import SinglePokemon from "./SinglePokemon";
import { Paper, Pagination } from "@mui/material";
const Pokemon = () => {
  const url = process.env.REACT_APP_POKEMON_API_KEY;
  //   overall 100 pokemon list
  const [pokemonList, setPokemonList] = useState([]);
  //   the number of pokemons shows on pagination
  const [displayNumberOnPage, setDisplayNumberOnPage] = useState();
  //   pagination
  const [page, setPage] = useState(1);
  //   the pokemons in the show list
  const [pokemonShowList, setPokemonShowList] = useState([]);

  //   add pokemons to show list
  const adjustDisplay = (res) => {
    let display = [];
    if (!res) {
      res = pokemonList;
    }

    for (let i = 0; i < screenWidth(); i++) {
      let num = page * screenWidth() - i - 1;
      if (res[num]) {
        display.unshift(res[num]);
      }
    }
    setPokemonShowList(display);
  };
  //   get all info from each pokemon
  const displayOnChange = async (data) => {
    let res = [];
    for (let i = 0; i < data.length; i++) {
      let pokemon = data[i];
      try {
        if (pokemon.url) {
          const response = await fetch(pokemon.url);
          const jsonData = await response.json();
          let thePokemon = {
            name: jsonData.name,
            imgUrl: jsonData.sprites.front_default,
            types: jsonData.types,
            star: false,
          };
          res.push(thePokemon);
        }
      } catch (e) {
        console.log(e);
      }
    }

    setPokemonList(res);
    adjustDisplay(res);
  };

  const getList = async () => {
    try {
      const response = await fetch(url + "?limit=100&offset=0", {
        method: "GET",
      });
      const jsonData = await response.json();
      displayOnChange(jsonData.results);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e, p) => {
    setPage(p);
  };
  const screenWidth = () => {
    let setNum = 0;
    if (window.innerWidth <= 480) {
      setNum = 2;
    } else if (window.innerWidth < 950) {
      setNum = 4;
    } else if (window.innerWidth >= 950) {
      setNum = 8;
    }
    if (setNum !== pokemonShowList.length && setNum !== displayNumberOnPage) {
      let num = Math.ceil(setNum / displayNumberOnPage) * page;
      setDisplayNumberOnPage(setNum);

      handleChange("", 1);
    }
    return setNum;
  };
  useEffect(() => {
    window.addEventListener("resize", screenWidth);
  });
  useEffect(() => {
    getList();
  }, []);
  useEffect(() => {
    adjustDisplay();
  }, [page, displayNumberOnPage]);

  return (
    <Fragment>
      <div>
        <h1>Pokedex</h1>

        <div className="pokemon-section">
          {pokemonShowList.map((i) => (
            <Fragment key={i.name}>
              {i ? <SinglePokemon pokemon={i} /> : ""}
            </Fragment>
          ))}
        </div>
        <Pagination
          count={Math.ceil(pokemonList.length / screenWidth())}
          onChange={handleChange}
        />
      </div>
    </Fragment>
  );
};

export default Pokemon;
