
USER_TOKEN = localStorage.getItem('token');
USER_NAME = localStorage.getItem('name');


function isFavorite(pokemonName) {
  return new Promise((resolve, reject) => {
    fetch('https://pokydexapi.cluster-ig3.igpolytech.fr' + '/favoris/api/favoris/')
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

// function qui verifie que l'utilisateur est admin
function isAdmin() {
  return new Promise((resolve, reject) => {
    fetch('https://pokydexapi.cluster-ig3.igpolytech.fr' + '/user/api/user/connected', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + USER_TOKEN
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data[0].role === "admin") {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des données utilisateur:', error);
        reject(error);
      });
  });
}


function createPokemonCard(pokemon) {
  const card_container = document.createElement('div');
  card_container.classList.add('card-container');
  const card = document.createElement('div');
  card.classList.add('card');
  card.classList.add('large-card');

  const front = document.createElement('img');
  front.classList.add('card-front');
  front.classList.remove('hidden');

  // Récupération de l'image
  front.classList.add('large-image');
  front.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemon.number + '.png';


  const back = document.createElement('div');
  back.classList.add('card-back');

  // Création des éléments pour afficher le numéro, le type et la nom du Pokémon
  const nameElement = document.createElement('h2');
  nameElement.textContent = pokemon.name;

  const numberElement = document.createElement('p');
  numberElement.textContent = pokemon.number;

  const typeElement = document.createElement('img');
  typeElement.src = 'images/' + pokemon.type + '.png';

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
      fetch('https://pokydexapi.cluster-ig3.igpolytech.fr' + '/favoris/api/favoris', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: USER_NAME, pokemonName: pokemon.name })
      })
      favoriteButton.textContent = 'Retirer des favoris';
    }
    else {

      fetch('https://pokydexapi.cluster-ig3.igpolytech.fr' + '/favoris/api/favoris/' + USER_NAME + '/' + pokemon.name, {
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

  card_container.appendChild(card);

  card.addEventListener('click', function () {
    if (event.target !== favoriteButton) { openModal(pokemon); }
  });

  return card_container;
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
  typeElement.src = 'images/' + pokemon.type + '.png';

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
  const pokemons = grid.getElementsByClassName('card-container');

  // Parcourir tous les Pokémon de la grille
  for (const pokemon of pokemons) {
    const pokemonName = pokemon.getElementsByClassName('card-back')[0].getElementsByTagName('h2')[0].textContent.toLowerCase();
    var pokemonType = pokemon.getElementsByClassName('card-back')[0].getElementsByTagName('img')[0].src;

    if (pokemonType.includes('Eau')) {
      pokemonType = 'Eau';
    } else if (pokemonType.includes('Feu')) {
      pokemonType = 'Feu';
    } else if (pokemonType.includes('Plante')) {
      pokemonType = 'Plante';
    } else if (pokemonType.includes('Electrik')) {
      pokemonType = 'Electrik';
    } else if (pokemonType.includes('Insecte')) {
      pokemonType = 'Insecte';
    } else if (pokemonType.includes('Vol')) {
      pokemonType = 'Vol';
    } else if (pokemonType.includes('Poison')) {
      pokemonType = 'Poison';
    } else if (pokemonType.includes('Sol')) {
      pokemonType = 'Sol';
    } else if (pokemonType.includes('Fee')) {
      pokemonType = 'Fee';
    } else if (pokemonType.includes('Combat')) {
      pokemonType = 'Combat';
    } else if (pokemonType.includes('Roche')) {
      pokemonType = 'Roche';
    } else if (pokemonType.includes('Spectre')) {
      pokemonType = 'Spectre';
    } else if (pokemonType.includes('Acier')) {
      pokemonType = 'Acier';
    } else if (pokemonType.includes('Glace')) {
      pokemonType = 'Glace';
    } else if (pokemonType.includes('Dragon')) {
      pokemonType = 'Dragon';
    } else if (pokemonType.includes('Tenebre')) {
      pokemonType = 'Tenebre';
    } else if (pokemonType.includes('Normal')) {
      pokemonType = 'Normal';
    } else if (pokemonType.includes('Psy')) {
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
fetch('https://pokydexapi.cluster-ig3.igpolytech.fr' + '/pokemon/api/pokemon')
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
  if (USER_TOKEN) {
    const grid = document.getElementById('grid');
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    fetch('https://pokydexapi.cluster-ig3.igpolytech.fr' + '/pokemon/api/pokemon')
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



// bouton d'ajout de pokemon pour les admins
const addPokemonButton = document.getElementById('addPokemonButton');
const deletePokemonButton = document.getElementById('deletePokemonButton');
const updatePokemonButton = document.getElementById('updatePokemonButton');

if (USER_TOKEN) {
  //retire la classe hidden si l'utilisateur est admin
  isAdmin().then(isAdmin => {
    if (isAdmin) {
      addPokemonButton.classList.remove('hidden');
      deletePokemonButton.classList.remove('hidden');
      updatePokemonButton.classList.remove('hidden');
    }
  });
}

var contenu = '';
// function pour bouton d'ajout de pokemon
function ouvrirFenetreSuppression() {
  // Création de la div de superposition

  var overlay = document.createElement('div');
  overlay.setAttribute('id', 'overlay');
  overlay.setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999;');

  // Contenu de la fenêtre
  var contenu = '<div class="fenetre" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; width: 400px;">';
  contenu += '<span class="fermer" onclick="fermerFenetre()">X</span>';
  contenu += '<h2>Quel Pokemon supprimer du pokedex ?</h2>';

  // Champs à renseigner
  contenu += 'Numéro : <input type="text" name="numero"><br>';
  contenu += '<button type="button" onclick="rechercherPokemon()">Rechercher</button>';
  contenu += '<button type="button" onclick="soumettreFormulaireSuppression()">Supprimer</button>';
  contenu += '</div>';

  overlay.innerHTML = contenu;

  // Ajout de la superposition à la page
  document.body.appendChild(overlay);
}

function fermerFenetre() {
  document.body.removeChild(overlay); // Supprime la superposition de la page
}

function rechercherPokemon() {
  var input = document.querySelector('input[name="numero"]');
  var inputValue = input.value;

  fetch('https://pokydexapi.cluster-ig3.igpolytech.fr' + '/pokemon/api/pokemon/' + inputValue)
    .then(response => response.json())
    .then(data => {
      var pokemonFound = data;
      if (pokemonFound) {
        openModal(pokemonFound[0]);
      } else {
        var message = '<p>Aucun pokemon avec ce numéro dans le pokedex</p>';
        contenu = contenu + message; // Met à jour la variable contenu
        overlay.innerHTML = contenu; // Met à jour le contenu de la superposition
      }
    });
}

function soumettreFormulaireSuppression(event) {
  var input = document.querySelector('input[name="numero"]');
  var inputValue = input.value;

  fetch('https://pokydexapi.cluster-ig3.igpolytech.fr' + '/pokemon/api/pokemon/' + inputValue)
    .then(response => response.json())
    .then(data => {
      var pokemonFound = data;
      if (pokemonFound) {
        openModal(pokemonFound[0]);
        fetch('https://pokydexapi.cluster-ig3.igpolytech.fr' + '/pokemon/api/pokemon/' + inputValue, {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + USER_TOKEN,
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
          })
          .catch(error => {
            console.error('Une erreur s\'est produite lors de la suppression du pokemon:', error);
          });
      } else {
        var message = '<p>Aucun pokemon avec ce numéro dans le pokedex</p>';
        contenu = contenu + message; // Met à jour la variable contenu
        overlay.innerHTML = contenu; // Met à jour le contenu de la superposition
      }
    });

  var input = document.querySelector('input[name="numero"]');
  // Suppression de la superposition de la page
  var overlay = document.getElementById('overlay');
  var input = document.querySelector('input[name="numero"]');
  overlay.parentNode.removeChild(overlay);
}

// function pour bouton d'ajout de pokemon
function ouvrirFenetreAjout() {
  // Création de la div de superposition
  var overlay = document.createElement('div');
  overlay.setAttribute('id', 'overlay');
  overlay.setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999;');

  // Contenu de la fenêtre
  var contenu = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; width: 400px;">';
  contenu += '<span class="fermer" onclick="fermerFenetre()">X</span>';
  contenu += '<h2>Renseignez les champs</h2>';
  contenu += '<form onsubmit="return soumettreFormulaireAjout(event);">';

  // Champs à renseigner
  contenu += 'Nom : <input type="text" name="name"><br>';
  contenu += 'Numéro : <input type="number" name="numero"><br>';
  contenu += 'Description : <input type="text" name="description"><br>';

  contenu += 'Type : <br>';
  var types = ['Normal', 'Feu', 'Eau', 'Electrik', 'Plante', 'Glace', 'Combat', 'Poison', 'Sol', 'Vol', 'Psy', 'Insecte', 'Roche', 'Spectre', 'Dragon', 'Tenebre', 'Acier', 'Fee'];
  for (var i = 0; i < types.length; i++) {
    contenu += '<input type="radio" name="type" value="' + types[i] + '"> ' + types[i] + '<br>';
  }

  // Bouton de soumission
  contenu += '<input type="submit" value="Soumettre">';
  contenu += '</form>';
  contenu += '</div>';

  overlay.innerHTML = contenu;

  // Ajout de la superposition à la page
  document.body.appendChild(overlay);
}

function soumettreFormulaireAjout(event) {
  event.preventDefault();

  var name = document.querySelector('input[name="name"]').value;
  var numero = parseInt(document.querySelector('input[name="numero"]').value);
  var description = document.querySelector('input[name="description"]').value;

  var typeElement = document.querySelector('input[name="type"]:checked');
  var type = typeElement ? typeElement.value : null;

  var body = {
    "name": name,
    "number": numero,
    "description": description,
    "type": type
  };

  console.log(body);

  fetch('https://pokydexapi.cluster-ig3.igpolytech.fr' + '/pokemon/api/pokemon', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + USER_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de la création du pokemon:', error);
    });

  // Suppression de la superposition de la page
  var overlay = document.getElementById('overlay');
  overlay.parentNode.removeChild(overlay);
}

function ouvrirFenetreModification() {
  // Création de la div de superposition
  var overlay = document.createElement('div');
  overlay.setAttribute('id', 'overlay');
  overlay.setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999;');

  // Contenu de la fenêtre
  var contenu = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; width: 400px;">';
  contenu += '<span class="fermer" onclick="fermerFenetre()">X</span>';
  contenu += '<h2>Quel Pokemon modifier ?</h2>';

  // Champs à renseigner
  contenu += 'Numéro : <input type="text" name="numero"><br>';
  contenu += '<button type="button" onclick="rechercherPokemon()">Rechercher</button>';

  // Champs à renseigner
  contenu += '<h2>Quelle modification apportée ?</h2>';
  contenu += '<form onsubmit="return soumettreFormulaireModification(event);">';
  contenu += 'Nom : <input type="text" name="name"><br>';
  contenu += 'Numéro : <input type="number" name="numero"><br>';
  contenu += 'Description : <input type="text" name="description"><br>';

  contenu += 'Type : <br>';
  var types = ['Normal', 'Feu', 'Eau', 'Electrik', 'Plante', 'Glace', 'Combat', 'Poison', 'Sol', 'Vol', 'Psy', 'Insecte', 'Roche', 'Spectre', 'Dragon', 'Tenebre', 'Acier', 'Fee'];
  for (var i = 0; i < types.length; i++) {
    contenu += '<input type="radio" name="type" value="' + types[i] + '"> ' + types[i] + '<br>';
  }

  // Bouton de soumission
  contenu += '<input type="submit" value="Soumettre">';
  contenu += '</form>';
  contenu += '</div>';

  overlay.innerHTML = contenu;

  // Ajout de la superposition à la page
  document.body.appendChild(overlay);
}

function soumettreFormulaireModification(event) {
  event.preventDefault();

  var name = document.querySelector('input[name="name"]').value;
  var numero = parseInt(document.querySelector('input[name="numero"]').value);
  var description = document.querySelector('input[name="description"]').value;

  var typeElement = document.querySelector('input[name="type"]:checked');
  var type = typeElement ? typeElement.value : null;

  var body = {
    "name": name,
    "number": numero,
    "description": description,
    "type": type
  };

  console.log(body);

  fetch('https://pokydexapi.cluster-ig3.igpolytech.fr' + '/pokemon/api/pokemon/' + numero, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + USER_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de la modification du pokemon:', error);
    });

  // Suppression de la superposition de la page
  var overlay = document.getElementById('overlay');
  overlay.parentNode.removeChild(overlay);
}