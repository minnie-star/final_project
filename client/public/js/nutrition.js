const apiKey = "eRj63pSLJUIdqcPdY0bfVvoVSh9LbHmVaXU6cDuc"; 

const analyzeBtn = document.getElementById("analyzeBtn");
const ingredientsInput = document.getElementById("ingredientsInput");
const nutritionResults = document.getElementById("nutritionResults");

analyzeBtn.addEventListener("click", async () => {
  const ingredients = ingredientsInput.value.trim().split("\n");
  if (!ingredients.length) {
    alert("Please enter ingredients!");
    return;
  }

  nutritionResults.innerHTML = "<p>Fetching nutrition data...</p>";

  try {
    let output = "<h2>Nutrition Breakdown</h2>";

    for (const item of ingredients) {
      const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(item)}&api_key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.foods && data.foods.length > 0) {
        const food = data.foods[0]; // take first match
        const nutrients = food.foodNutrients;

        const calories = nutrients.find(n => n.nutrientName === "Energy")?.value || "N/A";
        const protein = nutrients.find(n => n.nutrientName === "Protein")?.value || "N/A";
        const fat = nutrients.find(n => n.nutrientName === "Total lipid (fat)")?.value || "N/A";
        const carbs = nutrients.find(n => n.nutrientName === "Carbohydrate, by difference")?.value || "N/A";

        output += `
          <div class="food-item">
            <h3>${food.description}</h3>
            <p><strong>Calories:</strong> ${calories} kcal</p>
            <p><strong>Protein:</strong> ${protein} g</p>
            <p><strong>Fat:</strong> ${fat} g</p>
            <p><strong>Carbs:</strong> ${carbs} g</p>
          </div>
        `;
      } else {
        output += `<p>No data found for "${item}".</p>`;
      }
    }

    nutritionResults.innerHTML = output;
  } catch (error) {
    console.error("Error fetching USDA data:", error);
    nutritionResults.innerHTML = "<p>Failed to fetch nutrition data. Please try again.</p>";
  }
});

