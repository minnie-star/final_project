// Attach event to "Save to Favorites" button
document.getElementById("saveFavoriteBtn").addEventListener("click", () => {
  // Example recipe object (replace with your dynamic recipe data)
  const recipe = {
    title: document.getElementById("recipeTitle").textContent,
    ingredients: Array.from(document.querySelectorAll("#ingredientsList li")).map(li => li.textContent),
    instructions: Array.from(document.querySelectorAll("#instructionsList li")).map(li => li.textContent),
    nutrition: document.getElementById("nutritionResults").innerHTML
  };

  // Get existing favorites from LocalStorage
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Add new recipe
  favorites.push(recipe);

  // Save back to LocalStorage
  localStorage.setItem("favorites", JSON.stringify(favorites));

  alert("Recipe saved to Favorites!");
});