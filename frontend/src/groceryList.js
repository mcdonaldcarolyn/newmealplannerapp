import React, { useEffect, useState } from "react";
import api from "./axiosConfig";  // ✅ custom axios instance

export default function GroceryList() {
  const [grocery, setGrocery] = useState([]);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    unit: "",
  });

  // Fetch grocery list
  useEffect(() => {
    api.get("grocery/")   // ✅ no need to repeat /api/
      .then((res) => setGrocery(res.data))
      .catch((err) => console.error("Error fetching grocery list:", err));
  }, []);

  // Add new grocery item
  const handleAdd = async () => {
    if (!form.name) return;

    const newItem = {
      name: form.name,
      amount: form.amount ? parseFloat(form.amount) : null,
      unit: form.unit || "",
      checked: false,
    };

    try {
      const res = await api.post("grocery/", newItem);
      setGrocery([...grocery, res.data]);
      setForm({ name: "", amount: "", unit: "" });
    } catch (err) {
      console.error("Error adding grocery item:", err);
      alert("Failed to add item. Please try again.");
    }
  };

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
      <h1 className="text-2xl font-bold mb-6">Grocery List</h1>

      {/* Add Item Form */}
      <div className="bg-blue-50 p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Add Grocery Item</h2>
        <div className="grid grid-cols-3 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Item Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            type="number"
            placeholder="Amount (optional)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Unit (optional)"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </div>

      {/* Grocery List */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-xl font-bold mb-3">Shopping List</h3>
        {grocery.length === 0 ? (
          <p className="text-gray-500">No items in grocery list.</p>
        ) : (
          <ul className="space-y-2">
            {grocery.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-2 border-b">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id, item.checked)}
                    className="w-5 h-5"
                  />
                  <span className={item.checked ? "line-through text-gray-400" : "text-gray-700"}>
                    {item.amount && `${item.amount} `}
                    {item.unit && `${item.unit} `}
                    {item.name}
                  </span>
                </label>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-800 hover:underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
