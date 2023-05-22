
USER_TOKEN = localStorage.getItem('token');
USER_NAME = localStorage.getItem('name');


function isFavorite(pokemonName) {
  return new Promise((resolve, reject) => {
    fetch('https://pokydexapi.cluster-ig3.igpolytech.fr/favoris/api/favoris/')
      .then(response => response.json())
      .then(data => {
        for (const favoris of data) {
          if (favoris.userName === USER_NAME && favoris.pokemonName === pokemonName) {
            resolve(true);
            return;
          }
        }
        resolve(false);
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des favoris utilisateur:', error);
        reject(error);
      });
  });
}


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

  // Création des éléments pour afficher le numéro, le type et la nom du Pokémon
  const nameElement = document.createElement('h2');
  nameElement.textContent = pokemon.name;

  const numberElement = document.createElement('p');
  numberElement.textContent = pokemon.number;

  const typeElement = document.createElement('img');
  typeElement.src = 'images/'+pokemon.type+'.png';

  const favoriteButton = document.createElement('button');
  isFavorite(pokemon.name)
    .then(isFavorite => {
      if (isFavorite) {
        favoriteButton.textContent = 'Retirer des favoris';
      } else {
        favoriteButton.textContent = 'Ajouter aux favoris';
      }
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de la récupération des favoris utilisateur:', error);
    });

  favoriteButton.addEventListener('click', function () { 
    if (favoriteButton.textContent === 'Ajouter aux favoris') {
      fetch('https://pokydexapi.cluster-ig3.igpolytech.fr/favoris/api/favoris', {
          method: 'POST',        
          headers: {
          'Content-Type': 'application/json'
        },
          body: JSON.stringify({ userName: USER_NAME, pokemonName: pokemon.name })
        })
        favoriteButton.textContent = 'Retirer des favoris';
      }
      else {
        
        fetch('https://pokydexapi.cluster-ig3.igpolytech.fr/favoris/api/favoris/'+USER_NAME+'/'+pokemon.name, {
          method: 'DELETE',        
          headers: {
          'Content-Type': 'application/json'
        }
        })
        favoriteButton.textContent = 'Ajouter aux favoris';
        if (favCheckbox.checked) {
          card.remove();
        }
      }
  });



  // Ajout des éléments à la carte
  back.appendChild(nameElement);
  back.appendChild(numberElement);
  back.appendChild(typeElement);
  back.appendChild(favoriteButton);



  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('mouseenter', function() {
    front.classList.add('hidden');
  });

  card.addEventListener('mouseleave', function() {
    front.classList.remove('hidden');
  });

  card.addEventListener('click', function() {
    if (event.target !== favoriteButton){openModal(pokemon);}
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
    if (favCheckbox.checked) {
      isFavorite(pokemon.name)
        .then(isFavorite => {
          if (isFavorite) {
            const card = createPokemonCard(pokemon);
            grid.appendChild(card);
          }
        })
        .catch(error => {
          console.error('Une erreur s\'est produite lors de la récupération des favoris utilisateur:', error);
        });
      } else if (favCheckbox.checked === false) {
        const card = createPokemonCard(pokemon);
        grid.appendChild(card);
    }
  });
}

// Fonction pour filtrer les Pokémon en fonction de la saisie de l'utilisateur
function filterPokemons(searchString, selectedTypes) {
  const grid = document.getElementById('grid');
  const pokemons = grid.getElementsByClassName('card');

  // Parcourir tous les Pokémon de la grille
  for (const pokemon of pokemons) {
    const pokemonName = pokemon.getElementsByClassName('card-back')[0].getElementsByTagName('h2')[0].textContent.toLowerCase();
    var pokemonType = pokemon.getElementsByClassName('card-back')[0].getElementsByTagName('img')[0].src;

    if (pokemonType.includes('Eau')){
      pokemonType = 'Eau';
    } else if (pokemonType.includes('Feu')){
      pokemonType = 'Feu';
    } else if (pokemonType.includes('Plante')){
      pokemonType = 'Plante';
    } else if (pokemonType.includes('Electrik')){
      pokemonType = 'Electrik';
    } else if (pokemonType.includes('Insecte')){
      pokemonType = 'Insecte';
    } else if (pokemonType.includes('Vol')){
      pokemonType = 'Vol';
    } else if (pokemonType.includes('Poison')){
      pokemonType = 'Poison';
    } else if (pokemonType.includes('Sol')){
      pokemonType = 'Sol';
    } else if (pokemonType.includes('Fee')){
      pokemonType = 'Fee';
    } else if (pokemonType.includes('Combat')){
      pokemonType = 'Combat';
    } else if (pokemonType.includes('Roche')){
      pokemonType = 'Roche';
    } else if (pokemonType.includes('Spectre')){
      pokemonType = 'Spectre';
    } else if (pokemonType.includes('Acier')){
      pokemonType = 'Acier';
    } else if (pokemonType.includes('Glace')){
      pokemonType = 'Glace';
    } else if (pokemonType.includes('Dragon')){
      pokemonType = 'Dragon';
    } else if (pokemonType.includes('Tenebre')){
      pokemonType = 'Tenebres';
    } else if (pokemonType.includes('Normal')){
      pokemonType = 'Normal';
    } else if (pokemonType.includes('Psy')){
      pokemonType = 'Psy';
    }

    // Vérifier si le nom du Pokémon correspond à la saisie de l'utilisateur et si le type du Pokémon est sélectionné
    if (pokemonName.includes(searchString) && ((selectedTypes.length === 0 || selectedTypes.includes(pokemonType)))) {
      pokemon.style.display = 'flex'; // Afficher le Pokémon
    } else {
      pokemon.style.display = 'none'; // Masquer le Pokémon
    }
  }
}

// Écouteur d'événement pour la saisie de recherche et les cases à cocher de type
const searchInput = document.getElementById('searchInput');
const typeCheckboxes = document.querySelectorAll('#filterOptions input[type="checkbox"]');
const selectedTypes = [];

// Écouteur d'événement pour la saisie de recherche
searchInput.addEventListener('input', function (event) {
  const searchString = event.target.value.toLowerCase();
  filterPokemons(searchString, selectedTypes);
});

typeCheckboxes.forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    const checkedTypes = Array.from(typeCheckboxes)
      .filter(function (checkbox) {
        return checkbox.checked;
      })
      .map(function (checkbox) {
        return checkbox.value;
      });

    filterPokemons(searchInput.value.toLowerCase(), checkedTypes);
  });
});


// Récupération des données de Pokémon à partir du backend
fetch('https://pokydexapi.cluster-ig3.igpolytech.fr/pokemon/api/pokemon')
  .then(response => response.json())
  .then(data => {
    // Traiter les données JSON 
    //console.log(data); 
    
    // Appel de la fonction pour peupler la grille de Pokémon avec les données
    populateGrid(data);
  })
  .catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des données pokemon:', error);
  });

// Écouteur d'événement pour la case à cocher des favoris
const favCheckbox = document.getElementById('favoriteCheckbox');
favCheckbox.addEventListener('change', function () {
  if(USER_TOKEN){
    const grid = document.getElementById('grid');
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    fetch('https://pokydexapi.cluster-ig3.igpolytech.fr/pokemon/api/pokemon')
      .then(response => response.json())
      .then(data => {
        // Traiter les données JSON 
        //console.log(data); 
        
        // Appel de la fonction pour peupler la grille de Pokémon avec les données
        populateGrid(data);
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des données pokemon:', error);
      }); 
  } else {
      alert('Vous devez être connecté pour avoir des favoris');
  }
});



