// src/GroceryList.js
import React, { useEffect, useState } from "react";

export default function GroceryList() {
  const [grocery, setGrocery] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("groceryList") || "[]");
      setGrocery(saved);
    } catch {
      setGrocery([]);
    }
  }, []);

  // Toggle checked status
  const toggleItem = (id) => {
    const updated = grocery.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setGrocery(updated);
    localStorage.setItem("groceryList", JSON.stringify(updated));
  };

  // Delete item
  const removeItem = (id) => {
    const updated = grocery.filter((item) => item.id !== id);
    setGrocery(updated);
    localStorage.setItem("groceryList", JSON.stringify(updated));
  };

  if (!grocery.length) {
    return <p className="p-4">Your grocery list is empty.</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Grocery List</h1>
      <ul className="space-y-2">
        {grocery.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between border-b pb-2"
          >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(item.id)}
              />
              <span className={item.checked ? "line-through text-gray-500" : ""}>
                {item.amount} {item.unit} {item.name}
              </span>
            </label>
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
