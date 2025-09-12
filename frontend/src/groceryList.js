// src/GroceryList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/grocery/";

export default function GroceryList() {
  const [grocery, setGrocery] = useState([]);

  // Fetch grocery list
  useEffect(() => {
    axios.get(API_URL).then((res) => setGrocery(res.data));
  }, []);

  const toggleItem = async (id, checked) => {
    const updated = grocery.map((item) =>
      item.id === id ? { ...item, checked: !checked } : item
    );
    setGrocery(updated);
    await axios.patch(`${API_URL}${id}/`, { checked: !checked });
  };

  const removeItem = async (id) => {
    await axios.delete(`${API_URL}${id}/`);
    setGrocery(grocery.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Grocery List</h1>
      {grocery.length === 0 ? (
        <p>No items in grocery list.</p>
      ) : (
        <ul className="space-y-2">
          {grocery.map((item) => (
            <li key={item.id} className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(item.id, item.checked)}
                />
                {item.amount} {item.unit} {item.name}
              </label>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
