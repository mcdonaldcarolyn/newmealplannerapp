import React, { useEffect, useState } from "react";
import api from "./axiosConfig";  // ✅ custom axios instance

export default function GroceryList() {
  const [grocery, setGrocery] = useState([]);

  // Fetch grocery list
  useEffect(() => {
    api.get("grocery/")   // ✅ no need to repeat /api/
      .then((res) => setGrocery(res.data))
      .catch((err) => console.error("Error fetching grocery list:", err));
  }, []);

  // Toggle item checked/unchecked
  const toggleItem = async (id, checked) => {
    try {
      const res = await api.patch(`grocery/${id}/`, { checked: !checked });
      // Update state with patched item
      setGrocery((prev) =>
        prev.map((item) => (item.id === id ? res.data : item))
      );
    } catch (err) {
      console.error("Error toggling grocery item:", err);
    }
  };

  // Remove item
  const removeItem = async (id) => {
    try {
      await api.delete(`grocery/${id}/`);
      setGrocery((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting grocery item:", err);
    }
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
