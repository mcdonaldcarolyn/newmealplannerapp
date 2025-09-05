import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const PANTRY_API = "http://127.0.0.1:8000/api/pantry/";

function normalizeName(s = "") {
  return s.toLowerCase().replace(/[^a-z\s]/g, "").trim();
}

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [pantry, setPantry] = useState([]);
  const [error, setError] = useState("");

  // load grocery list from localStorage
  const [grocery, setGrocery] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("groceryList") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [r, p] = await Promise.all([
          axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
            params: {
              apiKey: process.env.REACT_APP_RECIPE_API_KEY,
              includeNutrition: false,
            },
          }),
          axios.get(PANTRY_API),
        ]);
        setRecipe(r.data);
        setPantry(p.data);
      } catch (e) {
        console.error(e);
        setError("Failed to load recipe or pantry data.");
      }
    };
    fetchAll();
  }, [id]);

  // quick lookup set for pantry item names
  const pantryNames = useMemo(
    () => new Set(pantry.map((it) => normalizeName(it.name))),
    [pantry]
  );

  const ingredientInPantry = (ing) => {
    const name =
      ing.nameClean || ing.name || (ing.originalName ?? "").split(",")[0];
    return pantryNames.has(normalizeName(name));
  };

  const addToGrocery = (ing) => {
    const uniqueKey = `${id}-${ing.id || Date.now()}-${normalizeName(
        ing.name || ing.nameClean || ing.original
      )}`;

    const item = {
      id: uniqueKey,
      name: ing.name || ing.nameClean || ing.original,
      amount: ing.amount,
      unit: ing.unit,
      recipeId: Number(id),
      checked: false,
    };
    // avoid duplicates
    if (!grocery.find((g) => g.id === item.id)) {
      const next = [...grocery, item];
      setGrocery(next);
      localStorage.setItem("groceryList", JSON.stringify(next));
    }
  };

  const addAllMissing = () => {
    if (!recipe?.extendedIngredients) return;
    const next = [...grocery];
    for (const ing of recipe.extendedIngredients) {
        if (!ingredientInPantry(ing)) {
            const uniqueKey = `${id}-${ing.id || Date.now()}-${normalizeName(
              ing.name || ing.nameClean || ""
            )}`;
      const item = {
        id: uniqueKey,
        name: ing.name || ing.nameClean || ing.original,
        amount: ing.amount,
        unit: ing.unit,
        recipeId: Number(id),
        checked: false,
      };
      if (!next.find((g) => g.id === item.id)) next.push(item);
    }
  }
          
    setGrocery(next);
    localStorage.setItem("groceryList", JSON.stringify(next));
  };

  if (error) return <p className="p-4 text-red-700">{error}</p>;
  if (!recipe) return <p className="p-4">Loading…</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/recipes" className="text-blue-600">&larr; Back to search</Link>

      <h1 className="text-2xl font-bold mt-2 mb-3">{recipe.title}</h1>
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="w-72 rounded mb-4" />
      )}

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={addAllMissing}
          className="bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700"
        >
          Add all missing to Grocery
        </button>
        <Link to="/grocerylist" className="text-blue-600 underline">
          View Grocery List
        </Link>
      </div>

      <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
      <ul className="space-y-2 mb-6">
        {recipe.extendedIngredients?.map((ing) => {
          const inPantry = ingredientInPantry(ing);
          return (
            <li key={ing.id} className="flex items-center justify-between border-b pb-2">
              <span>
                {ing.original}{" "}
                {inPantry ? (
                  <span className="text-emerald-700 font-medium">— In pantry ✓</span>
                ) : (
                  <span className="text-amber-700 font-medium">— Missing</span>
                )}
              </span>
              {!inPantry && (
                <button
                  onClick={() => addToGrocery(ing)}
                  className="text-sm bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Add to Grocery
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Instructions</h2>
      {recipe.instructions ? (
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: recipe.instructions }}
        />
      ) : (
        <p>No instructions provided.</p>
      )}
    </div>
  );
}
