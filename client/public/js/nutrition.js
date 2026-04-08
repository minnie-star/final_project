const appId = 'YOUR_EDAMAM_APP_ID'; // replace with your Edamam app ID
const appKey = 'YOUR_EDAMAM_APP_KEY'; // replace with your Edamam app key

const analyzeBtn = document.getElementById('analyzeBtn');
const ingredientsInput = document.getElementById('ingredientsInput');
const nutritionResults = document.getElementById('nutritionResults');

analyzeBtn.addEventListener('click', async () => {
  const ingredients = ingredientsInput.value.trim();
  if (!ingredients) {
    alert('Please enter ingredients!');
    return;
  }

  const url = `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${appKey}&ingr=${encodeURIComponent(ingredients)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayNutrition(data);
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
  }
});

function displayNutrition(data) {
  nutritionResults.innerHTML = `
    <h3>Nutrition Breakdown</h3>
    <p><strong>Calories:</strong> ${data.calories || 'N/A'} kcal</p>
    <p><strong>Protein:</strong> ${data.totalNutrients.PROCNT?.quantity.toFixed(1) || 'N/A'} g</p>
    <p><strong>Carbs:</strong> ${data.totalNutrients.CHOCDF?.quantity.toFixed(1) || 'N/A'} g</p>
    <p><strong>Fat:</strong> ${data.totalNutrients.FAT?.quantity.toFixed(1) || 'N/A'} g</p>
    <p><strong>Fiber:</strong> ${data.totalNutrients.FIBTG?.quantity.toFixed(1) || 'N/A'} g</p>
  `;
}
