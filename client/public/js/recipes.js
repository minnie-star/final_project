const apiKey = '5ed052f56a404a0c945da244c8085f56';
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const recipesContainer = document.getElementById('recipesContainer');

searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  if (!query) {
    alert('Please enter a recipe keyword!');
    return;
  }

  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=6&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayRecipes(data.results);
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
});

function displayRecipes(recipes) {
  recipesContainer.innerHTML = '';
  recipes.forEach((recipe) => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <button onclick="viewRecipe(${recipe.id})">View Details</button>
    `;
    recipesContainer.appendChild(card);
  });
}

function viewRecipe(id) {
  window.location.href = `./recipe-details.html?id=${id}`;
}
