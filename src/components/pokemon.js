import { Fragment, useEffect, useState } from "react";
import React from "react";
import "./style.css";
import colors from "./typeColor/colors";
import { Paper, Pagination } from "@mui/material";
const Pokemon = () => {
  const url = process.env.REACT_APP_POKEMON_API_KEY;
  //   overall 100 pokemon list
  const [pokemonList, setPokemonList] = useState([]);
  //   the number of pokemons shows on pagination
  const [displayNumberOnPage, setDisplayNumberOnPage] = useState(8);
  //   pagination
  const [page, setPage] = useState(1);
  //   the pokemons in the show list
  const [pokemonShowList, setPokemonShowList] = useState([]);
  const screenWidth = () => {
    let setNum = 0;
    if (window.innerWidth <= 480) {
      setNum = 2;
    } else if (window.innerWidth < 950) {
      setNum = 4;
    } else if (window.innerWidth >= 950) {
      setNum = 8;
    }
    setDisplayNumberOnPage(setNum);
  };
  //   add pokemons to show list
  const adjustDisplay = (res) => {
    let display = [];
    if (!res) {
      res = pokemonList;
      console.log("no get");
    }
    for (let i = 0; i < displayNumberOnPage; i++) {
      let num = page * displayNumberOnPage - i - 1;
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
    screenWidth();
    adjustDisplay(res);
  };

  const getList = async () => {
    try {
      const response = await fetch(url + "?limit=100&offset=0", {
        method: "GET",
      });
      const jsonData = await response.json();
      screenWidth();
      setPokemonList(jsonData.results);
      displayOnChange(jsonData.results);
    } catch (e) {
      console.log(e);
    }
    console.log("getlist");
  };

  const handleChange = (e, p) => {
    setPage(p);
  };

  useEffect(() => {
    getList();
  }, []);
  useEffect(() => {
    // getList();
    adjustDisplay();
  }, [page]);

  //   window.addEventListener("resize", () => {
  //     adjustDisplay();
  //   });
  return (
    <Fragment>
      <div>
        <h1>Pokedex</h1>

        <div className="pokemon-section">
          {pokemonShowList.map((i) => (
            <Paper key={i.name} elevation={3} square>
              <button>
                <i
                  className={i.star ? "fa-solid fa-star" : "fa-regular fa-star"}
                  onClick={(e) => {
                    i.star = !i.star;
                    e.target.className = i.star
                      ? "fa-solid fa-star"
                      : "fa-regular fa-star";
                  }}
                ></i>
              </button>
              <h3>{i.name}</h3>
              <img src={i.imgUrl}></img>
              <div className="types">
                {i.types.map((j) => (
                  <p
                    key={i.name + " " + j.type.name}
                    style={{ background: colors(j.type.name) }}
                  >
                    {j.type.name}
                  </p>
                ))}
              </div>
            </Paper>
          ))}
        </div>
        <Pagination
          count={Math.ceil(pokemonList.length / displayNumberOnPage)}
          onChange={handleChange}
        />
      </div>
    </Fragment>
  );
};

export default Pokemon;
