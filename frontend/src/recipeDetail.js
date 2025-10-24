import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import api from "./axiosConfig";

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
          api.get("pantry/"),
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

  const addToGrocery = async(ing) => {
    const item = {
      name: ing.name || ing.nameClean || ing.original,
      amount: ing.amount || null,
      unit: ing.unit || "",
      checked: false,
    };
    try {
        const res = await api.post("grocery/", item);

        // avoid duplicates in React state
        if (!grocery.find((g) => g.id === res.data.id)) {
          setGrocery([...grocery, res.data]);
        }
      } catch (e) {
        console.error("Error adding to grocery:", e);
        alert("Failed to add item to grocery list.");
      }
  };

  const addToMealPlan = async () => {
    try {
      await api.post("mealplan/", {
        date: new Date().toISOString().split("T")[0], // today by default
        recipe_id: recipe.id,
        title: recipe.title,
        image: recipe.image,
      });
      alert("Recipe saved to meal plan!");
    } catch (err) {
      console.error("Error saving meal plan:", err);
      alert("Failed to save to meal plan.");
    }
  };
  
  const addAllMissing = async() => {
    if (!recipe?.extendedIngredients) return;

    try {
      const newItems = [];
      for (const ing of recipe.extendedIngredients) {
        if (!ingredientInPantry(ing)) {
          const item = {
            name: ing.name || ing.nameClean || ing.original,
            amount: ing.amount || null,
            unit: ing.unit || "",
            checked: false,
          };

          // Only add if not already in list
          if (!grocery.find((g) => g.name === item.name)) {
            const res = await api.post("grocery/", item);
            newItems.push(res.data);
          }
        }
      }
      setGrocery([...grocery, ...newItems]);
      alert(`Added ${newItems.length} items to grocery list!`);
    } catch (e) {
      console.error("Error adding missing items:", e);
      alert("Failed to add items to grocery list.");
    }
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
        <button
             onClick={addToMealPlan}
                className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700"
        >
        Save to Meal Plan
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
