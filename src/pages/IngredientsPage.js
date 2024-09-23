import React, { useState, useRef } from 'react';
import './IngredientsPage.css';

const IngredientsPage = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // State to track selected recipe
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal open status
  const recipeContainerRef = useRef(null);

  const ingredients = [
    // List of ingredients here
  ];

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prevState) =>
      prevState.includes(ingredient)
        ? prevState.filter((i) => i !== ingredient)
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
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data.recipes);

        setTimeout(() => {
          if (recipeContainerRef.current) {
            const navbarHeight =
              document.querySelector('.navbar')?.offsetHeight || 0;
            const scrollPosition =
              recipeContainerRef.current.offsetTop - navbarHeight - 20;
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

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe); // Set the selected recipe
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedRecipe(null); // Clear the selected recipe
  };

  return (
    <div className="ingredients-page">
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

      {/* Display the recipes as cards */}
      <div ref={recipeContainerRef} className="recipes-container">
        {recipes.map((recipe, index) => (
          <div
            key={index}
            className="recipe-card"
            onClick={() => handleRecipeClick(recipe)} // Handle click to open modal
          >
            <h3>{recipe.title}</h3>
            <p>Cooking Time: {recipe.cooking_time}</p>
            <p>Servings: {recipe.servings}</p>
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
