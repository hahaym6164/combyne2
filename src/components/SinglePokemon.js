import React, { Component, Fragment } from "react";
import { Paper, Pagination } from "@mui/material";
import colors from "./typeColor/colors";

const SinglePokemon = (data) => {
  const pokemon = data.pokemon;
  return (
    <Fragment>
      <Paper elevation={3} square>
        <button>
          <i
            className={pokemon.star ? "fa-solid fa-star" : "fa-regular fa-star"}
            onClick={(e) => {
              pokemon.star = !pokemon.star;
              e.target.className = pokemon.star
                ? "fa-solid fa-star"
                : "fa-regular fa-star";
            }}
          ></i>
        </button>
        <h3>{pokemon.name}</h3>
        <img src={pokemon.imgUrl}></img>
        <div className="types">
          {pokemon.types.map((j) => (
            <p
              key={pokemon.name + " " + j.type.name}
              style={{ background: colors(j.type.name) }}
            >
              {j.type.name}
            </p>
          ))}
        </div>
      </Paper>
    </Fragment>
  );
};

export default SinglePokemon;
