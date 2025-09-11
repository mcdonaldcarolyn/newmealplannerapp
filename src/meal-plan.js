
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MealPlan() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/mealplan/")
      .then((res) => setMeals(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Meal Plan</h1>
      <ul className="space-y-3">
        {meals.map((meal) => (
          <li key={meal.id} className="flex items-center gap-4 border-b pb-2">
            {meal.image && (
              <img
                src={meal.image}
                alt={meal.title}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <span className="font-medium">{meal.date} — {meal.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
