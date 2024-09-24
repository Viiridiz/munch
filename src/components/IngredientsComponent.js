import React, { useState, useRef, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; // Firestore imports
import { onAuthStateChanged } from 'firebase/auth'; // Firebase Auth for logged-in user
import './IngredientsComponent.css';

const IngredientsPage = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favoritedRecipes, setFavoritedRecipes] = useState([]); // To store favorited recipes
  const [user, setUser] = useState(null); // Track logged-in user
  const recipeContainerRef = useRef(null);

  const ingredients = [
    'Tomato', 'Cheese', 'Chicken', 'Fish', 'Potatoes', 'Noodles', 'Beef', 'Pork', 'Carrots',
    'Broccoli', 'Onion', 'Garlic', 'Lettuce', 'Cucumber', 'Spinach', 'Peas', 'Mushrooms',
    'Bell Pepper', 'Zucchini', 'Eggplant', 'Corn', 'Cauliflower', 'Asparagus', 'Sweet Potatoes',
    'Green Beans', 'Cabbage', 'Celery', 'Avocado', 'Radishes', 'Beets', 'Lemon', 'Lime', 'Oranges',
    'Apples', 'Bananas', 'Strawberries', 'Blueberries', 'Raspberries', 'Grapes', 'Cherries',
    'Peaches', 'Plums', 'Pineapple', 'Mango', 'Papaya', 'Kiwi', 'Watermelon', 'Melon', 'Pumpkin',
    'Squash', 'Yam', 'Quinoa', 'Rice', 'Barley', 'Oats', 'Millet', 'Flour', 'Bread', 'Pasta',
    'Tortillas', 'Bagels', 'Bacon', 'Sausage', 'Ham', 'Tofu', 'Tempeh', 'Lentils', 'Chickpeas',
    'Black Beans', 'Kidney Beans', 'Lima Beans', 'Peanuts', 'Almonds', 'Cashews', 'Walnuts',
    'Pecans', 'Sunflower Seeds', 'Chia Seeds', 'Flax Seeds', 'Pumpkin Seeds', 'Sesame Seeds',
    'Basil', 'Oregano', 'Thyme', 'Rosemary', 'Cilantro', 'Parsley', 'Dill', 'Mint', 'Bay Leaves',
    'Cinnamon', 'Nutmeg', 'Ginger', 'Turmeric', 'Curry Powder', 'Paprika', 'Cumin', 'Coriander',
    'Chili Powder', 'Soy Sauce', 'Vinegar', 'Olive Oil', 'Coconut Oil', 'Butter', 'Cream', 'Milk',
    'Yogurt', 'Eggs', 'Sour Cream', 'Mozzarella', 'Parmesan', 'Feta', 'Gouda', 'Brie', 'Swiss Cheese',
    'Cream Cheese', 'Honey', 'Maple Syrup', 'Sugar', 'Brown Sugar', 'Chocolate', 'Vanilla',
    'Peanut Butter', 'Jelly', 'Jam', 'Mayonnaise', 'Ketchup', 'Mustard', 'Hot Sauce', 'Barbecue Sauce',
    'Ranch Dressing', 'Italian Dressing', 'Sriracha', 'Salsa', 'Hummus', 'Guacamole', 'Tzatziki',
    'Pickles', 'Olives', 'Capers', 'Artichokes', 'Sun-dried Tomatoes', 'Coconut', 'Almond Milk',
    'Coconut Milk', 'Soy Milk', 'Shrimp', 'Salmon', 'Tuna', 'Crab', 'Lobster', 'Clams', 'Oysters',
    'Scallops', 'Squid', 'Octopus', 'Duck', 'Turkey', 'Veal', 'Lamb', 'Venison', 'Bison', 'Goat',
    'Quail', 'Rabbit', 'Frog Legs', 'Escargot', 'Caviar'
  ];

  // Listen for the authenticated user
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadFavoritedRecipes(currentUser); // Load favorited recipes on user login
      } else {
        setUser(null);
      }
    });
  }, []);

  // Load favorited recipes from Firestore
  const loadFavoritedRecipes = async (currentUser) => {
    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    if (userDoc.exists()) {
      setFavoritedRecipes(userDoc.data().favorites || []);
    }
  };

  // Toggle ingredient selection
  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prevState) =>
      prevState.includes(ingredient)
        ? prevState.filter((i) => i !== ingredient)
        : [...prevState, ingredient]
    );
  };

  // Submit selected ingredients and fetch recipes
  const submitIngredients = () => {
    fetch('http://localhost:5000/generate-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients: selectedIngredients }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data.recipes);

        setTimeout(() => {
          if (recipeContainerRef.current) {
            const navbarHeight =
              document.querySelector('.navbar')?.offsetHeight || 0;
            const scrollPosition =
              recipeContainerRef.current.offsetTop - navbarHeight - 120;
            window.scrollTo({
              top: scrollPosition,
              behavior: 'smooth',
            });
          }
        }, 300);
      })
      .catch((err) => console.error('Error:', err));
  };

  const removeSelectedIngredient = (ingredient) => {
    setSelectedIngredients((prevState) =>
      prevState.filter((i) => i !== ingredient)
    );
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);

    if (value) {
      const filtered = ingredients.filter((ingredient) =>
        ingredient.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredIngredients(filtered);
    } else {
      setFilteredIngredients([]);
    }
  };

  const handleIngredientClick = (ingredient) => {
    toggleIngredient(ingredient);
    setSearchValue('');
    setFilteredIngredients([]);
  };

  // Handle favoriting a recipe
  const toggleFavoriteRecipe = async (recipe) => {
    if (!user) {
      alert("Please sign in to favorite recipes.");
      return;
    }

    const userDocRef = doc(db, "users", user.uid);

    // Check if the recipe is already favorited
    const isFavorited = favoritedRecipes.some((r) => r.title === recipe.title);

    if (isFavorited) {
      // Unfavorite the recipe
      await updateDoc(userDocRef, {
        favorites: arrayRemove(recipe)
      });
      setFavoritedRecipes(favoritedRecipes.filter((r) => r.title !== recipe.title));
    } else {
      // Favorite the recipe
      await updateDoc(userDocRef, {
        favorites: arrayUnion(recipe)
      });
      setFavoritedRecipes([...favoritedRecipes, recipe]);
    }
  };

  // Handle recipe click to open the modal
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="ingredients-page">

      <h1>Your <span>favourites.</span></h1>
      <div className="favorites-container">
        {favoritedRecipes.map((recipe, index) => (
          <div key={index} className="recipe-card">
            <h3>{recipe.title}</h3>
            <p>Cooking Time: {recipe.cooking_time}</p>
            <p>Servings: {recipe.servings}</p>

            <div className="button-container">
            <button onClick={() => handleRecipeClick(recipe)}>View Recipe</button>
              {/* Favorite button */}
              <button onClick={() => toggleFavoriteRecipe(recipe)}>
                {favoritedRecipes.some((r) => r.title === recipe.title)
                  ? 'Unfavorite'
                  : 'Favorite'}
              </button>
            </div>
          </div>
        ))}
      </div>

    <h1>
      Select <span>ingredients</span> and{' '}
      <span className="go" onClick={submitIngredients}>
        munch.
      </span>
    </h1>

    {/* Search bar for ingredients */}
    <input
      type="text"
      className="ingredient-search"
      value={searchValue}
      onChange={handleSearchChange}
      placeholder="...or search them if you are lazy"
    />

    {filteredIngredients.length > 0 && (
      <div className="dropdown">
        {filteredIngredients.map((ingredient) => (
          <div
            key={ingredient}
            className="dropdown-item"
            onClick={() => handleIngredientClick(ingredient)}
          >
            {ingredient}
          </div>
        ))}
      </div>
    )}

    <div className="ingredients-container">
      {ingredients.map((ingredient) => (
        <button
          key={ingredient}
          className={`ingredient-button ${
            selectedIngredients.includes(ingredient) ? 'selected' : ''
          }`}
          onClick={() => toggleIngredient(ingredient)}
        >
          {ingredient}
        </button>
      ))}
    </div>

    {/* Selected Ingredients Container */}
    <div className="selected-ingredients-container">
      {selectedIngredients.map((ingredient) => (
        <div key={ingredient} className="ingredient-card selected-ingredient">
          <button onClick={() => removeSelectedIngredient(ingredient)}>
            {ingredient}
          </button>
        </div>
      ))}
    </div>

      <h1 ref={recipeContainerRef}>The <span>recipes.</span></h1>
      <div className="recipes-container">
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe-card">
            <h3>{recipe.title}</h3>
            <p>Cooking Time: {recipe.cooking_time}</p>
            <p>Servings: {recipe.servings}</p>

            <div className="button-container">
            <button onClick={() => handleRecipeClick(recipe)}>View Recipe</button>
              {/* Favorite button */}
              <button onClick={() => toggleFavoriteRecipe(recipe)}>
                {favoritedRecipes.some((r) => r.title === recipe.title)
                  ? 'Unfavorite'
                  : 'Favorite'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for showing detailed recipe information */}
      {isModalOpen && selectedRecipe && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedRecipe.title}</h2>
            <h3>Ingredients</h3>
            <ul>
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.quantity} {ingredient.unit} {ingredient.name}
                </li>
              ))}
            </ul>
            <h3>Instructions</h3>
            <ol>
              {selectedRecipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
            <p>Cooking Time: {selectedRecipe.cooking_time}</p>
            <p>Servings: {selectedRecipe.servings}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientsPage;
