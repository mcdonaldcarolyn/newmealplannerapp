//import logo from './logo.svg';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Pantry from './pantry';
import Recipes from './recipes';
import Mealplan from './meal-plan';
import LocationList from './locationList';
import LocationDetail from './LocationDetail';
import RecipeDetail from "./recipeDetail";
import GroceryList from './groceryList';


function App() {
  return (
  
     <div>
      <h1>
        Home page
      </h1>
        <nav>
          <ul>
            <li>
            <Link to="/">Home</Link>
            </li>
            <li>
             <Link to='/pantry'>pantry</Link>
            </li>
            <li>
              <Link to='/recipes'>recipes</Link>
            </li>
            <li>
              <Link to='/grocerylist'>grocery list</Link>
            </li>
            <li>
              <Link to='/meal-plan'>meal plan for the week/month</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<h2>Welcome to the Pantry App!</h2>} />
          <Route path="/pantry" element={<Pantry />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/grocerylist" element={< GroceryList />} />
          <Route path="/meal-plan" element={<Mealplan />} />
          <Route path="/locations" element={<LocationList />} />
          <Route path="/locations/:id" element={<LocationDetail />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} /> {/* detail page */}
        </Routes>
      </div>
   
  );
}

export default App;
