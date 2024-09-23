import React, { useState, useRef } from 'react';
import './IngredientsComponent.css'; // Assuming you've moved the styles here

const IngredientsComponent = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]); // State to hold the recipes
  const [searchValue, setSearchValue] = useState(''); // State to hold the search input value
  const [filteredIngredients, setFilteredIngredients] = useState([]); // State to hold the filtered ingredients
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

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients(prevState =>
      prevState.includes(ingredient)
        ? prevState.filter(i => i !== ingredient)
        : [...prevState, ingredient]
    );
  };

  const submitIngredients = () => {
    fetch('http://localhost:5000/generate-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients: selectedIngredients }),
    })
      .then(res => res.json())
      .then(data => {
        setRecipes(data.recipes);
        setTimeout(() => {
          if (recipeContainerRef.current) {
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const scrollPosition = recipeContainerRef.current.offsetTop - navbarHeight - 20;
            window.scrollTo({
              top: scrollPosition,
              behavior: 'smooth',
            });
          }
        }, 300);
      })
      .catch(err => console.error('Error:', err));
  };

  const removeSelectedIngredient = (ingredient) => {
    setSelectedIngredients(prevState =>
      prevState.filter(i => i !== ingredient)
    );
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    if (value) {
      const filtered = ingredients.filter(ingredient =>
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

  return (
    <div className="ingredients-component">
      <h1>Select <span>ingredients</span> and <span className="go" onClick={submitIngredients}>munch.</span></h1>

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
          {filteredIngredients.map(ingredient => (
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
        {ingredients.map(ingredient => (
          <button
            key={ingredient}
            className={`ingredient-button ${selectedIngredients.includes(ingredient) ? 'selected' : ''}`}
            onClick={() => toggleIngredient(ingredient)}
          >
            {ingredient}
          </button>
        ))}
      </div>

      <div className="selected-ingredients-container">
        {selectedIngredients.map(ingredient => (
          <div key={ingredient} className="ingredient-card selected-ingredient">
            <button onClick={() => removeSelectedIngredient(ingredient)}>{ingredient}</button>
          </div>
        ))}
      </div>

      <div ref={recipeContainerRef} className="recipes-container">
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe-card">
            <h3>{recipe.title}</h3>
            <p>Cooking Time: {recipe.cooking_time}</p>
            <p>Servings: {recipe.servings}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientsComponent;
