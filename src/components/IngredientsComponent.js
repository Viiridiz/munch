import React, { useState, useRef, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; // Firestore imports
import { onAuthStateChanged } from 'firebase/auth'; // Firebase Auth for logged-in user
import './IngredientsComponent.css';
import Header from './Header';
import Timer from './Timer';
import Footer from './Footer';

const IngredientsPage = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favoritedRecipes, setFavoritedRecipes] = useState([]); // To store favorited recipes
  const [user, setUser] = useState(null); // Track logged-in user
  const ingredientsRef = useRef(null);
  const recipeContainerRef = useRef(null);
  const favoritedRecipesRef = useRef(null);
  const [recipeType, setRecipeType] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [maxTime, setMaxTime] = useState('');
  const allergyOptions = ['Gluten', 'Nuts', 'Dairy', 'Eggs'];
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  // Handle recipe type selection
  const handleRecipeTypeChange = (event) => {
    setRecipeType(event.target.value);
  };

  // Handle allergy checkbox changes
  const handleAllergyChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setAllergies((prev) => [...prev, value]);
    } else {
      setAllergies((prev) => prev.filter((allergy) => allergy !== value));
    }
  };

  // Handle max cooking time input change
  const handleMaxTimeChange = (event) => {
    setMaxTime(event.target.value);
  };

  const ingredients = [
    // Common Vegetables
    'Tomato', 'Cheese', 'Chicken', 'Fish', 'Potatoes', 'Noodles', 'Beef', 'Pork', 'Carrots',
    'Broccoli', 'Onion', 'Garlic', 'Lettuce', 'Cucumber', 'Spinach', 'Peas', 'Mushrooms',
    'Bell Pepper', 'Zucchini', 'Eggplant', 'Corn', 'Cauliflower', 'Asparagus', 'Sweet Potatoes',
    'Green Beans', 'Cabbage', 'Celery', 'Avocado', 'Radishes', 'Beets', 'Pumpkin', 'Squash', 'Yam',

    // Fruits
    'Lemon', 'Lime', 'Oranges', 'Apples', 'Bananas', 'Strawberries', 'Blueberries', 'Raspberries',
    'Grapes', 'Cherries', 'Peaches', 'Plums', 'Pineapple', 'Mango', 'Papaya', 'Kiwi', 'Watermelon',
    'Melon', 'Cantaloupe', 'Cranberries', 'Pomegranate', "Durian", "Dragonfruit",

    // Grains and Breads
    'Quinoa', 'Rice', 'Barley', 'Oats', 'Millet', 'Couscous', 'Farro', 'Flour', 'Bread', 'Pasta',
    'Tortillas', 'Bagels', 'Naan', 'Pita Bread',

    // Meats & Proteins
    'Bacon', 'Sausage', 'Ham', 'Tofu', 'Tempeh', 'Lentils', 'Chickpeas', 'Black Beans', 'Kidney Beans',
    'Lima Beans', 'Peanuts', 'Almonds', 'Cashews', 'Walnuts', 'Pecans', 'Sunflower Seeds', 'Chia Seeds',
    'Flax Seeds', 'Pumpkin Seeds', 'Sesame Seeds', 'Shrimp', 'Salmon', 'Tuna', 'Crab', 'Lobster',
    'Clams', 'Oysters', 'Scallops', 'Squid', 'Octopus', 'Duck', 'Turkey', 'Veal', 'Lamb', 'Venison',
    'Bison', 'Goat', 'Quail', 'Rabbit', 'Frog Legs', 'Escargot', 'Caviar', 'Eggs', 

    // Dairy and Dairy Alternatives
    'Milk', 'Cream', 'Yogurt', 'Sour Cream', 'Mozzarella', 'Parmesan', 'Feta', 'Gouda', 'Brie',
    'Swiss Cheese', 'Cream Cheese', 'Butter', 'Coconut Milk', 'Almond Milk', 'Soy Milk', 'Oat Milk',

    // Oils and Fats
    'Olive Oil', 'Coconut Oil', 'Vegetable Oil', 'Canola Oil', 'Sesame Oil','Lard', 'Ghee',

    // Sauces & Condiments
    'Soy Sauce', 'Vinegar', 'Mayonnaise', 'Ketchup', 'Mustard', 'Hot Sauce', 'Barbecue Sauce',
    'Ranch Dressing', 'Italian Dressing', 'Sriracha', 'Salsa', 'Hummus', 'Guacamole', 'Tzatziki',
    'Pickles', 'Olives', 'Capers', 'Sun-dried Tomatoes', 'Artichokes', 'Truffles',

    // Herbs & Spices
    'Basil', 'Oregano', 'Thyme', 'Rosemary', 'Cilantro', 'Parsley', 'Dill', 'Mint', 'Bay Leaves',
    'Cinnamon', 'Nutmeg', 'Ginger', 'Turmeric', 'Curry Powder', 'Paprika', 'Cumin', 'Coriander',
    'Chili Powder', 'Black Pepper', 'Salt', 'Saffron', 'Cayenne Pepper', 'Garlic Powder', 'Onion Powder',

    // Sweeteners & Baking
    'Sugar', 'Brown Sugar', 'Honey', 'Maple Syrup', 'Chocolate', 'Vanilla', 'Peanut Butter', 'Jelly',
    'Jam', 'Molasses', 'Corn Syrup', 'Baking Soda', 'Baking Powder', 'Yeast', 'Gelatin', 'Cocoa Powder',

    // Drinks & Liquid Ingredients
    'Coffee', 'Tea', 'Coconut Water', 'Orange Juice', 'Lemon Juice', 'Lime Juice', 'Apple Juice',
    'Sparkling Water', 'Soda Water',

    // Snacks & Miscellaneous
    'Crackers', 'Chips', 'Popcorn', 'Pretzels', 'Granola', 'Oat Bars', 'Energy Bars', 'Raisins',
    'Dried Apricots', 'Dried Cranberries', 'Marshmallows', 'Nutella', 'Rice Cakes', 'Fruit Snacks',

    // Canned and Preserved
    'Canned Tomatoes', 'Canned Beans', 'Canned Corn', 'Canned Tuna', 'Canned Sardines', 'Canned Soup',
    'Canned Fruit',  'Canned Peas', 'Canned Fish', 'Canned Beans',

    // Other
    'Anchovies', 'Tahini', 'Miso Paste', 'Coconut Flakes', 'Breadcrumbs', 'Cornmeal', 'Polenta', 'Panko',

    // More Frozen Foods
    'Frozen Broccoli', 'Frozen Mixed Vegetables', 'Frozen Corn', 'Frozen Cauliflower',
    'Frozen Sweet Potatoes', 'Frozen French Fries', 'Frozen Chicken Nuggets',
    'Frozen Waffles', 'Frozen Pancakes',

    // More Dairy Products
    'Sour Cream', 'Cream Cheese', 'Neufchâtel Cheese', 'Greek Yogurt', 'Kefir',
    'Heavy Whipping Cream', 'Clotted Cream', 'Dairy-Free Yogurt', 'Cottage Cheese'
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
    setLoading(true); // Start loading
  
    const requestBody = {
      ingredients: selectedIngredients,
      recipeType,
      allergies,
      maxTime,
    };
  
    fetch('http://localhost:5000/generate-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecipes(Array.isArray(data.recipes) ? data.recipes : []);
        setLoading(false); // Stop loading once data is received
  
        setTimeout(() => {
          if (recipeContainerRef.current) {
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const scrollPosition = recipeContainerRef.current.offsetTop - navbarHeight - 120;
            window.scrollTo({
              top: scrollPosition,
              behavior: 'smooth',
            });
          }
        }, 300);
      })
      .catch((err) => {
        console.error('Error:', err);
        setLoading(false); // Stop loading if there's an error
      });
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
  
  // Handle key press in the search input field
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && searchValue.trim()) {
      const ingredient = searchValue.trim();
      
      // Add custom ingredient to selected ingredients
      if (!selectedIngredients.includes(ingredient)) {
        setSelectedIngredients((prevState) => [...prevState, ingredient]);
      }
  
      // Clear the search input and filtered list
      setSearchValue('');
      setFilteredIngredients([]);
    }
  };

  const handleIngredientClick = (ingredient) => {
    toggleIngredient(ingredient);
    setSearchValue('');
    setFilteredIngredients([]);
  };

  const handleRetry = () => {
    setRecipes([]);  // Clear current recipes
    submitIngredients();  // Fetch a new recipe
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
    setSelectedRecipe(recipe); // Set the selected recipe
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsClosing(true); // Trigger the closing animation
    setTimeout(() => {
      setIsModalOpen(false); // Close the modal after the animation
      setSelectedRecipe(null); // Clear the selected recipe
      setIsClosing(false); // Reset the closing state
    }, 300); // Match the duration of the `scaleOut` animation
  };

  return (
    <>
    {loading && (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    )}

    
    <Header
        ingredientsRef={ingredientsRef}
        recipeContainerRef={recipeContainerRef}
        favoritedRecipesRef={favoritedRecipesRef}
      />

    <div className="ingredients-page" >

      <h1>Your <span>saved recipes.</span></h1>
      <div className="favorites-container" ref={favoritedRecipesRef}>
      <div className="empty-message">
        {favoritedRecipes.length === 0 && (
          <p className="empty-message">No saved recipes yet. Start by adding some recipes to your saved.</p>
          )}
      </div>
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
                  ? 'Unsave'
                  : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>

    <div class="ingredients-selection-card" ref={ingredientsRef}>


    <h1>Select <span>ingredients</span> and{' '}
      <span className="go" onClick={submitIngredients}>
        generate.
      </span>
    </h1>
    
    <div class="recipe-selection-container">
      {/* Recipe Type Selection */}
      <label htmlFor="recipeType" class="form-label">Select Recipe Type:</label>
      <select
        className="recipe-type-dropdown"
        id="recipeType"
        value={recipeType}
        onChange={handleRecipeTypeChange}
      >
        <option value="">Any</option>
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
        <option value="dessert">Dessert</option>
      </select>
      
      {/* Allergy Filter */}
    <div class="allergy-filter-container">
      <label class="form-label">Allergies (Exclude ingredients):</label>
      <div class="allergy-options">
        {allergyOptions.map((allergy) => (
          <label key={allergy} class="checkbox-label">
            <input
              className="allergy-filter-checkbox"
              type="checkbox"
              value={allergy.toLowerCase()}
              onChange={handleAllergyChange}
            />
            {allergy}
          </label>
        ))}
      </div>
    </div>


      {/* Maximum Time */}
      <label htmlFor="maxTime" class="form-label">Max Cooking Time (minutes):</label>
      <input
        className="max-time-input"
        type="number"
        id="maxTime"
        value={maxTime}
        onChange={handleMaxTimeChange}
        placeholder="e.g. 30"
      />

      {/* Search bar for ingredients */}
      <label htmlFor="ingredientSearch" class="form-label">Search Ingredients:</label>
      <input
        type="text"
        id="ingredientSearch"
        className="ingredient-search-input"
        value={searchValue}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
        placeholder="Search for ingredients or make your own..."
      />

      {filteredIngredients.length > 0 && (
        <div className="dropdown-menu">
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

      {/* Selected Ingredients */}
      <div className="selected-ingredients-container">
        {selectedIngredients.map((ingredient) => (
          <div key={ingredient} className="ingredient-card selected-ingredient">
            <button
              className="remove-ingredient-button"
              onClick={() => removeSelectedIngredient(ingredient)}
            >
              {ingredient}
            </button>
          </div>
        ))}
      </div>
    </div>

  </div>

      <h1 ref={recipeContainerRef}>The <span>recipes.</span></h1>
      <div className="recipes-container" ref={recipeContainerRef}>
      <div className="empty-message">
        {recipes.length === 0 && (
          <p className="empty-message">No recipes generated yet. Please select ingredients and generate a recipe.</p>
          )}
      </div>
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe-card">
          <h3>{recipe.title}</h3>
          <p>Cooking Time: {recipe.cooking_time}</p>
          <p>Servings: {recipe.servings}</p>
        
          <div className="button-container">
            <button onClick={() => handleRecipeClick(recipe)}>View Recipe</button>
            <button onClick={() => toggleFavoriteRecipe(recipe)}>
              {favoritedRecipes.some((r) => r.title === recipe.title) ? 'Unsave' : 'Save'}
            </button>
            <button onClick={handleRetry}>Retry</button> {/* Retry Button */}
          </div>
        </div>
        
        ))}
      </div>

      {/* Modal for showing detailed recipe information */}
      {isModalOpen && selectedRecipe && (
        <div className="modal">
          <div className={`modal-content ${isClosing ? 'closing' : ''}`}>
            <span className="close-button" onClick={closeModal}>&times;</span>
            <h2>{selectedRecipe.title}</h2>
            <div className="recipe-container-details">
              <p className={`healthy-meter healthy-meter-${selectedRecipe.healthyMeter.toLowerCase()}`}>
                <strong>Healthy Meter:</strong> {selectedRecipe.healthyMeter}
              </p>
              <p><strong>{selectedRecipe.Kcal} Kcal</strong></p>
              <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
            </div>
            <h3>Ingredients</h3>
            <ul className="ingredients-list">
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index} className="ingredient-item">
                  {ingredient.quantity} {ingredient.unit} {ingredient.name}
                </li>
              ))}
            </ul>
            <h3>Instructions</h3>
            <ol className="instructions-list">
              {selectedRecipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
            <div className="cooking-time-container">
              <p><strong>Cooking Time:</strong> {selectedRecipe.cooking_time}</p>
              {/* Timer Component */}
              <Timer duration={parseInt(selectedRecipe.cooking_time.match(/\d+/)?.[0] || 0, 10)} />
            </div>
          </div>
        </div>
      )}

      <div className="footer">
        <Footer></Footer>
      </div>

    </div>
    </>
  );
};

export default IngredientsPage;
