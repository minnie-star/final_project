const apiKey = "5ed052f56a404a0c945da244c8085f56"; 

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const recipeId = params.get("id");

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  let recipe;
  if (recipeId !== null && favorites[recipeId]) {
    recipe = favorites[recipeId]; // Load from Favorites
  } else {
    // Fallback example recipe
    recipe = {
      title: "Spaghetti Carbonara",
      meta: "Prep: 15 min | Cook: 20 min | Serves: 4",
      ingredients: ["spaghetti", "pancetta", "eggs", "parmesan cheese"],
      instructions: [
        "Boil spaghetti until al dente.",
        "Fry pancetta until crisp.",
        "Whisk eggs and Parmesan together.",
        "Drain pasta, toss with pancetta, remove from heat.",
        "Stir in egg mixture quickly to create a creamy sauce.",
        "Season with salt and pepper, serve immediately."
      ],
      nutrition: ""
    };
  }

  // Populate recipe details
  document.getElementById("recipeTitle").textContent = recipe.title;
  document.getElementById("recipeMeta").textContent = recipe.meta;
  document.getElementById("ingredientsList").innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join("");
  document.getElementById("instructionsList").innerHTML = recipe.instructions.map(i => `<li>${i}</li>`).join("");

  const nutritionResults = document.getElementById("nutritionResults");

  // If nutrition data is missing, fetch from USDA
  if (!recipe.nutrition || recipe.nutrition.trim() === "") {
    nutritionResults.innerHTML = "<p>Fetching nutrition data...</p>";
    let output = "";

    for (const item of recipe.ingredients) {
      const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(item)}&api_key=${apiKey}`;
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.foods && data.foods.length > 0) {
          const food = data.foods[0];
          const nutrients = food.foodNutrients;

          const calories = nutrients.find(n => n.nutrientName === "Energy")?.value || "N/A";
          const protein = nutrients.find(n => n.nutrientName === "Protein")?.value || "N/A";
          const fat = nutrients.find(n => n.nutrientName === "Total lipid (fat)")?.value || "N/A";
          const carbs = nutrients.find(n => n.nutrientName === "Carbohydrate, by difference")?.value || "N/A";

          output += `
            <div class="food-item">
              <h4>${food.description}</h4>
              <p><strong>Calories:</strong> ${calories} kcal</p>
              <p><strong>Protein:</strong> ${protein} g</p>
              <p><strong>Fat:</strong> ${fat} g</p>
              <p><strong>Carbs:</strong> ${carbs} g</p>
            </div>
          `;
        } else {
          output += `<p>No data found for "${item}".</p>`;
        }
      } catch (error) {
        console.error("Error fetching USDA data:", error);
        output += `<p>Error fetching data for "${item}".</p>`;
      }
    }

    nutritionResults.innerHTML = output;

    // Save updated nutrition back to LocalStorage
    if (recipeId !== null && favorites[recipeId]) {
      favorites[recipeId].nutrition = output;
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  } else {
    nutritionResults.innerHTML = recipe.nutrition;
  }

  // Favorites button logic
  document.getElementById("saveFavoriteBtn").addEventListener("click", () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push({
      title: recipe.title,
      meta: recipe.meta,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      nutrition: nutritionResults.innerHTML
    });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Recipe saved to Favorites!");
  });
});