// src/Pantry.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function Pantry() {
  const [pantry, setPantry] = useState([]);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    unit: "",
    location_id: "",
  });

  const PANTRY_API = "http://127.0.0.1:8000/api/pantry/";
  const LOC_API = "http://127.0.0.1:8000/api/locations/";

  // Load pantry + locations
  useEffect(() => {
    axios.get(PANTRY_API).then((res) => setPantry(res.data));
    axios.get(LOC_API).then((res) => setLocations(res.data));
  }, []);

  // Add item to pantry
  const handleAdd = async () => {
    if (!form.name || !form.quantity || !form.unit) return;

    const newItem = {
      name: form.name,
      quantity: parseFloat(form.quantity),
      unit: form.unit,
      location_id: form.location_id || null,
    };

    const res = await axios.post(PANTRY_API, newItem);
    setPantry([...pantry, res.data]);
    setForm({ name: "", quantity: "", unit: "", location_id: "" });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pantry Inventory</h1>

      {/* Add Item Form */}
      <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Add New Item</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Item Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Unit (e.g., kg, box)"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={form.location_id}
            onChange={(e) => setForm({ ...form, location_id: e.target.value })}
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </div>

      {/* Pantry List */}
      <ul className="divide-y divide-gray-300">
        {pantry.map((item) => (
          <li key={item.id} className="flex justify-between py-2">
            <span>
              {item.quantity} {item.unit} {item.name}{" "}
              {item.location ? `(${item.location.name})` : ""}
            </span>
            <button
              onClick={() =>
                axios.delete(`${PANTRY_API}${item.id}/`).then(() =>
                  setPantry(pantry.filter((i) => i.id !== item.id))
                )
              }
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pantry;
