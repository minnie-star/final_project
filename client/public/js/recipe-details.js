const apiKey = 'YOUR_SPOONACULAR_API_KEY'; // replace with your key
const recipeDetails = document.getElementById('recipeDetails');

// Get recipe ID from query string
const params = new URLSearchParams(window.location.search);
const recipeId = params.get('id');

async function fetchRecipeDetails() {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`
    );
    const data = await response.json();
    displayRecipeDetails(data);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
  }
}

function displayRecipeDetails(recipe) {
  recipeDetails.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.title}">
    <h2>${recipe.title}</h2>
    <p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes | <strong>Servings:</strong> ${recipe.servings}</p>

    <div class="ingredients">
      <h3>Ingredients</h3>
      <ul>
        ${recipe.extendedIngredients.map((ing) => `<li>${ing.original}</li>`).join('')}
      </ul>
    </div>

    <div class="instructions">
      <h3>Instructions</h3>
      <p>${recipe.instructions || 'No instructions available.'}</p>
    </div>

    <div class="nutrition">
      <h3>Nutrition (basic)</h3>
      <p>Calories: ${recipe.nutrition?.nutrients?.find((n) => n.name === 'Calories')?.amount || 'N/A'} kcal</p>
      <p>Protein: ${recipe.nutrition?.nutrients?.find((n) => n.name === 'Protein')?.amount || 'N/A'} g</p>
      <p>Carbs: ${recipe.nutrition?.nutrients?.find((n) => n.name === 'Carbohydrates')?.amount || 'N/A'} g</p>
      <p>Fat: ${recipe.nutrition?.nutrients?.find((n) => n.name === 'Fat')?.amount || 'N/A'} g</p>
    </div>
  `;
}

fetchRecipeDetails();
