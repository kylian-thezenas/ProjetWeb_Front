

// Fonction pour créer une carte de Pokémon
function createPokemonCard(pokemon) {
  const card = document.createElement('div');
  card.classList.add('card');

  const front = document.createElement('img');
  front.classList.add('card-front');
  

  //recupération image
  front.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+pokemon.number+'.png';

  const back = document.createElement('div');
  back.classList.add('card-back');
  back.textContent = pokemon.name;

  card.appendChild(front);
  card.appendChild(back);

  return card;
}

// Fonction pour ajouter les cartes de Pokémon à la grille
function populateGrid(pokemonData) {
  const grid = document.getElementById('grid');

  pokemonData.forEach((pokemon) => {
    const card = createPokemonCard(pokemon);
    grid.appendChild(card);
  });
}

// Exemple de récupération des données de Pokémon à partir du backend
fetch('http://localhost:8000/pokemon/api/pokemon')
  .then(response => response.json())
  .then(data => {
    // Traitez les données JSON ici
    console.log(data); // Affiche les données JSON dans la console
    
    // Appel de la fonction pour peupler la grille de Pokémon avec les données
    populateGrid(data);
  })
  .catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des données :', error);
  });
