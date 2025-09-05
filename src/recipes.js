// src/Recipes.js
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Recipes() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);

  const API_KEY = process.env.REACT_APP_RECIPE_API_KEY;
  const API_URL = "https://api.spoonacular.com/recipes/complexSearch";

  const searchRecipes = async () => {
    if (!query) return;
    try {
      const res = await axios.get(API_URL, {
        params: {
          query: query,
          number: 5, // number of recipes to return
          apiKey: API_KEY,
        },
      });
      setRecipes(res.data.results);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Find Recipes</h1>

      {/* Search Bar */}
      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="Search for recipes..."
          className="flex-grow border p-2 rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={searchRecipes}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Search
        </button>
      </div>

      {/* Recipe Results */}
      <ul className="grid gap-4">
      {recipes.map((recipe) => (
    <li
      key={recipe.id}
      className="border rounded-lg shadow p-4 flex items-center gap-4"
    >
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-20 h-20 object-cover rounded"
        />
      )}
      <Link
        to={`/recipes/${recipe.id}`}
        className="font-medium text-blue-700 hover:underline"
      >
        {recipe.title}
      </Link>
    </li>
  ))}
      </ul>
    </div>
  );
}

export default Recipes;
