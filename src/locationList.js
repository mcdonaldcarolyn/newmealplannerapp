import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = "http://127.0.0.1:8000/api/locations/";

function LocationList() {
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    axios.get(API_URL).then(res => setLocations(res.data));
  }, []);

  const handleAdd = async () => {
    if (!name) return;
    const res = await axios.post(API_URL, { name });
    setLocations([...locations, res.data]);
    setName('');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Locations</h1>
      <div className="mb-4 space-x-2">
        <input 
          className="border p-1" 
          placeholder="Add a location" 
          value={name} 
          onChange={e => setName(e.target.value)} 
        />
        <button onClick={handleAdd} className="bg-green-500 text-white px-3 py-1 rounded">Add</button>
      </div>
      <ul>
        {locations.map(loc => (
          <li key={loc.id} className="border-b py-1">
            <Link to={`/locations/${loc.id}`} className="text-blue-600">{loc.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocationList;
