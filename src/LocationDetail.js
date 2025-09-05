// src/LocationDetail.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function LocationDetail() {
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState("");

  const API_URL = "http://127.0.0.1:8000/api/locations/";

  useEffect(() => {
    axios.get(API_URL).then((res) => setLocations(res.data));
  }, []);

  const handleAddLocation = async () => {
    if (!name) return;
    const res = await axios.post(API_URL, { name });
    setLocations([...locations, res.data]);
    setName("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Locations</h1>

      <div className="mb-4 space-x-2">
        <input
          className="border p-1"
          placeholder="Location Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleAddLocation}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Add Location
        </button>
      </div>

      <ul>
        {locations.map((loc) => (
          <li key={loc.id} className="py-1 border-b">
            {loc.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocationDetail;
