USER_TOKEN = localStorage.getItem('token');


function createPokemonCard(pokemon) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.classList.add('large-card');

  const front = document.createElement('img');
  front.classList.add('card-front');
  front.classList.remove('hidden');

  // Récupération de l'image
  front.classList.add('large-image');
  front.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+pokemon.number+'.png';
 

  const back = document.createElement('div');
  back.classList.add('card-back');

  // Création des éléments pour afficher le numéro, le type et la description
  const nameElement = document.createElement('h2');
  nameElement.textContent = pokemon.name;

  const numberElement = document.createElement('p');
  numberElement.textContent = pokemon.number;

  const typeElement = document.createElement('img');
  typeElement.src = '../images/'+pokemon.type+'.png';


  // Ajout des éléments à la carte
  back.appendChild(nameElement);
  back.appendChild(numberElement);
  back.appendChild(typeElement);



  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('mouseenter', function() {
    front.classList.add('hidden');
  });

  card.addEventListener('mouseleave', function() {
    front.classList.remove('hidden');
  });

  card.addEventListener('click', function() {
    openModal(pokemon);
  });

  return card;
}

function openModal(pokemon) {
  const modal = document.createElement('div');
  modal.classList.add('modal');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const closeBtn = document.createElement('span');
  closeBtn.classList.add('close-btn');
  closeBtn.innerHTML = '&times;';

  const pokemonContainer = document.createElement('div');
  pokemonContainer.classList.add('pokemon-container');

  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');

  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('image-wrapper');

  const front = document.createElement('img');
  front.classList.add('card-front');
  front.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemon.number + '.png';

  imageWrapper.appendChild(front);
  imageContainer.appendChild(imageWrapper);

  const infoContainer = document.createElement('div');
  infoContainer.classList.add('info-container');

  const nameElement = document.createElement('h2');
  nameElement.textContent = pokemon.name;

  const numberElement = document.createElement('p');
  numberElement.textContent = 'n° : ' + pokemon.number;

  const typeElement = document.createElement('img');
  typeElement.src = '../images/'+pokemon.type+'.png';

  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = pokemon.description;

  imageContainer.appendChild(front);
  infoContainer.appendChild(nameElement);
  infoContainer.appendChild(numberElement);
  infoContainer.appendChild(typeElement);
  infoContainer.appendChild(descriptionElement);
  pokemonContainer.appendChild(imageContainer);
  pokemonContainer.appendChild(infoContainer);

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(pokemonContainer);

  modal.appendChild(modalContent);

  document.body.appendChild(modal);

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', closeModal);

  function closeModal() {
    document.body.removeChild(modal);
  }
}

// Fonction pour ajouter les cartes de Pokémon à la grille
function populateGrid(pokemonData) {
  const grid = document.getElementById('grid');

  pokemonData.forEach((pokemon) => {
    const card = createPokemonCard(pokemon);
    grid.appendChild(card);
  });
}



// Récupération des données de Pokémon à partir du backend
fetch('http://localhost:8000/pokemon/api/pokemon')
  .then(response => response.json())
  .then(data => {
    // Traiter les données JSON 
    console.log(data); 
    
    // Appel de la fonction pour peupler la grille de Pokémon avec les données
    populateGrid(data);
  })
  .catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des données pokemon:', error);
  });




