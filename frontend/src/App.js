//import logo from './logo.svg';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Pantry from './pantry';
import Recipes from './recipes';
import Mealplan from './meal-plan';
import LocationList from './locationList';
import LocationDetail from './LocationDetail';
import RecipeDetail from "./recipeDetail";
import GroceryList from './groceryList';
import Login from './Login';
import Signup from './Signup';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
  };

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (isLoading) return <div>Loading...</div>;
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
     <div>
      <h1>Meal Planner App</h1>

      {isAuthenticated && (
        <nav className="mb-4">
          <ul className="flex gap-4 list-none">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to='/pantry'>Pantry</Link>
            </li>
            <li>
              <Link to='/recipes'>Recipes</Link>
            </li>
            <li>
              <Link to='/grocerylist'>Grocery List</Link>
            </li>
            <li>
              <Link to='/meal-plan'>Meal Plan</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-red-600">Logout</button>
            </li>
          </ul>
        </nav>
      )}

      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <Login setAuth={setIsAuthenticated} />
        } />
        <Route path="/signup" element={
          isAuthenticated ? <Navigate to="/" /> : <Signup />
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <h2>Welcome to the Meal Planner App!</h2>
            <p>Use the navigation above to manage your pantry, grocery list, and meal plans.</p>
          </ProtectedRoute>
        } />
        <Route path="/pantry" element={
          <ProtectedRoute>
            <Pantry />
          </ProtectedRoute>
        } />
        <Route path="/recipes" element={
          <ProtectedRoute>
            <Recipes />
          </ProtectedRoute>
        } />
        <Route path="/grocerylist" element={
          <ProtectedRoute>
            <GroceryList />
          </ProtectedRoute>
        } />
        <Route path="/meal-plan" element={
          <ProtectedRoute>
            <Mealplan />
          </ProtectedRoute>
        } />
        <Route path="/locations" element={
          <ProtectedRoute>
            <LocationList />
          </ProtectedRoute>
        } />
        <Route path="/locations/:id" element={
          <ProtectedRoute>
            <LocationDetail />
          </ProtectedRoute>
        } />
        <Route path="/recipes/:id" element={
          <ProtectedRoute>
            <RecipeDetail />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
