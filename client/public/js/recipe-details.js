const apiKey = "5ed052f56a404a0c945da244c8085f56"; 

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const recipeId = params.get("id"); // Spoonacular recipe ID passed in query string

  if (!recipeId) {
    document.getElementById("recipeTitle").textContent = "No recipe selected.";
    return;
  }

  try {
    // Fetch recipe details from Spoonacular
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
    const response = await fetch(url);
    const recipe = await response.json();

    // Populate recipe details
    document.getElementById("recipeTitle").textContent = recipe.title;
    document.getElementById("recipeMeta").textContent = `Ready in ${recipe.readyInMinutes} min | Servings: ${recipe.servings}`;

    // Ingredients
    const ingredientsList = recipe.extendedIngredients
      .map(ing => `<li>${ing.original}</li>`)
      .join("");
    document.getElementById("ingredientsList").innerHTML = ingredientsList;

    // Instructions
    if (recipe.analyzedInstructions.length > 0) {
      const steps = recipe.analyzedInstructions[0].steps
        .map(step => `<li>${step.step}</li>`)
        .join("");
      document.getElementById("instructionsList").innerHTML = steps;
    } else {
      document.getElementById("instructionsList").innerHTML = "<li>No instructions available.</li>";
    }

    // Nutrition (optional: Spoonacular has nutrition endpoint)
    const nutritionUrl = `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${apiKey}`;
    const nutritionResponse = await fetch(nutritionUrl);
    const nutrition = await nutritionResponse.json();

    document.getElementById("nutritionResults").innerHTML = `
      <p><strong>Calories:</strong> ${nutrition.calories}</p>
      <p><strong>Carbs:</strong> ${nutrition.carbs}</p>
      <p><strong>Fat:</strong> ${nutrition.fat}</p>
      <p><strong>Protein:</strong> ${nutrition.protein}</p>
    `;

    // Save to Favorites
    document.getElementById("saveFavoriteBtn").addEventListener("click", () => {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      favorites.push({
        id: recipe.id,
        title: recipe.title,
        meta: `Ready in ${recipe.readyInMinutes} min | Servings: ${recipe.servings}`,
        ingredients: recipe.extendedIngredients.map(ing => ing.original),
        instructions: recipe.analyzedInstructions[0]?.steps.map(step => step.step) || [],
        nutrition: document.getElementById("nutritionResults").innerHTML
      });
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Recipe saved to Favorites!");
    });

  } catch (error) {
    console.error("Error fetching recipe:", error);
    document.getElementById("recipeTitle").textContent = "Error loading recipe.";
  }
});