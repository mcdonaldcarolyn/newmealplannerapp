// src/Pantry.js
import React, { useEffect, useState } from "react";
import api from "./axiosConfig";

function Pantry() {
  const [pantry, setPantry] = useState([]);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    unit: "",
    location_id: "",
  });
  const [newLocation, setNewLocation] = useState("");

  
  // Load pantry + locations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pantryRes = await api.get("pantry/");
        setPantry(pantryRes.data);
      } catch (err) {
        console.error("Error loading pantry:", err);
      }

      try {
        const locRes = await api.get("locations/");
        setLocations(locRes.data);
      } catch (err) {
        console.error("Error loading locations:", err);
      }
    };
    fetchData();
  }, []);

  // Add new location
  const handleAddLocation = async () => {
    if (!newLocation.trim()) return;

    try {
      const res = await api.post("locations/", { name: newLocation });
      setLocations([...locations, res.data]);
      setNewLocation("");
      alert(`Location "${res.data.name}" added successfully!`);
    } catch (err) {
      console.error("Error adding location:", err);
      if (err.response?.data?.name) {
        alert(`Error: ${err.response.data.name[0]}`);
      } else {
        alert("Failed to add location. It may already exist.");
      }
    }
  };

  // Add item to pantry
  const handleAdd = async () => {
    if (!form.name || !form.quantity || !form.unit) return;

    const newItem = {
      name: form.name,
      quantity: parseFloat(form.quantity),
      unit: form.unit,
      location_id: form.location_id || null,
    };

    try {
      const res = await api.post("pantry/", newItem);
      setPantry([...pantry, res.data]);
      setForm({ name: "", quantity: "", unit: "", location_id: "" });
    } catch (err) {
      console.error("Error adding pantry item:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      if (err.response?.data) {
        alert(`Failed to add item: ${JSON.stringify(err.response.data)}`);
      } else {
        alert("Failed to add item. Please try again.");
      }
    }
  };

  // Group pantry items by location
  const groupedPantry = () => {
    const grouped = {};

    pantry.forEach((item) => {
      const locationName = item.location ? item.location.name : "No Location";
      if (!grouped[locationName]) {
        grouped[locationName] = [];
      }
      grouped[locationName].push(item);
    });

    return grouped;
  };

  const pantryGroups = groupedPantry();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pantry Inventory</h1>

      {/* Add Location Form */}
      <div className="bg-green-50 p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Add New Location</h2>
        <div className="flex gap-2">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Location name (e.g., Fridge, Pantry, Freezer)"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddLocation()}
          />
          <button
            onClick={handleAddLocation}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Location
          </button>
        </div>
      </div>

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

      {/* Pantry List Grouped by Location */}
      <div className="space-y-6">
        {Object.keys(pantryGroups).sort().map((locationName) => (
          <div key={locationName} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold mb-3 text-gray-800 border-b pb-2">
              {locationName}
            </h3>
            <ul className="divide-y divide-gray-200">
              {pantryGroups[locationName].map((item) => (
                <li key={item.id} className="flex justify-between items-center py-3">
                  <span className="text-gray-700">
                    <span className="font-semibold">{item.name}</span>
                    {" - "}
                    <span className="text-gray-600">
                      {item.quantity} {item.unit}
                    </span>
                  </span>
                  <button
                    onClick={() =>
                      api.delete(`pantry/${item.id}/`).then(() =>
                        setPantry(pantry.filter((i) => i.id !== item.id))
                      )
                    }
                    className="text-red-600 hover:text-red-800 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pantry;
