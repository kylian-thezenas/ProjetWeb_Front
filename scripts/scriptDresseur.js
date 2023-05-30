USER_TOKEN = localStorage.getItem('token');
USER_NAME = localStorage.getItem('name');


fetch('https://pokydexapi.cluster-ig3.igpolytech.fr' + '/dresseur/api/dresseur')
    .then(response => response.json())
    .then(data => {
        console.log('Voici les dresseurs:', data);
        populateGrid(data);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des données dresseurs:', error);
    });

function populateGrid(data) {
    const grid = document.getElementById('grid');
    data.forEach(dresseur => {
        console.log(dresseur.name);
        const card = createDresseur(dresseur);
        grid.appendChild(card);
    });
}

if (USER_TOKEN) {
    //retire la classe hidden si l'utilisateur est admin
    isAdmin().then(isAdmin => {
        if (isAdmin) {
            addDresseurButton.classList.remove('hidden');
            deleteDresseurButton.classList.remove('hidden');
            updateDresseurButton.classList.remove('hidden');
        }
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

function createDresseur(element) {
    const card_container = document.createElement('div');
    card_container.className = 'card-container';
    const imgDresseur_container = document.createElement('div');
    const iconeDresseur = document.createElement('img');
    iconeDresseur.src = 'images/iconeUser.png'
    imgDresseur_container.className = 'imgDresseur-container';
    imgDresseur_container.appendChild(iconeDresseur);
    card_container.appendChild(imgDresseur_container);

    const nameDresseur = document.createElement('h3');
    nameDresseur.textContent = element.name;
    nameDresseur.className = 'nameDresseur';
    imgDresseur_container.appendChild(nameDresseur);

    const infoDresseur_container = document.createElement('div');
    const descriptionDresseur = document.createElement('p');
    descriptionDresseur.textContent = element.description;
    descriptionDresseur.className = 'descriptionDresseur';
    infoDresseur_container.appendChild(descriptionDresseur);


    const imgPokemon_container = document.createElement('div');
    const equipeDresseur = document.createElement('h4');
    equipeDresseur.textContent = 'Equipe :';
    imgPokemon_container.appendChild(equipeDresseur);
    fetch('http://localhost:5000' + '/equipe/api/equipe/' + element.name)
        .then(response => response.json())
        .then(data => {
            console.log('Voici l\'équipe du dresseur:', data.nameDresseur);
            console.log(data.pokemon1);
            var img = document.createElement('img');
            img.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + data.pokemon1 + '.png';
            img.alt = 'pokemon';
            img.className = 'card-img';
            imgPokemon_container.appendChild(img);
            if (data.pokemon2 != null && data.pokemon2 != "undefined") {
                console.log(data.pokemon2);
                var img2 = document.createElement('img');
                img2.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + data.pokemon2 + '.png';
                img2.alt = 'pokemon';
                img2.className = 'card-img';
                imgPokemon_container.appendChild(img2);
            }
            if (data.pokemon3 != "undefined" && data.pokemon3 != null) {
                console.log(data.pokemon3);
                var img3 = document.createElement('img');
                img3.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + data.pokemon3 + '.png';
                img3.alt = 'pokemon';
                img3.className = 'card-img';
                imgPokemon_container.appendChild(img3);
            }
            if (data.pokemon4 != "undefined" && data.pokemon4 != null) {
                console.log(data.pokemon4);
                var img4 = document.createElement('img');
                img4.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + data.pokemon4 + '.png';
                img4.alt = 'pokemon';
                img4.className = 'card-img';
                imgPokemon_container.appendChild(img4);
            }
            if (data.pokemon5 != "undefined" && data.pokemon5 != null) {
                console.log(data.pokemon5);
                var img5 = document.createElement('img');
                img5.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + data.pokemon5 + '.png';
                img5.alt = 'pokemon';
                img5.className = 'card-img';
                imgPokemon_container.appendChild(img5);
            }
            if (data.pokemon6 != "undefined" && data.pokemon6 != null) {
                console.log(data.pokemon6);
                var img6 = document.createElement('img');
                img6.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + data.pokemon6 + '.png';
                img6.alt = 'pokemon';
                img6.className = 'card-img';
                imgPokemon_container.appendChild(img6);
            }

        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données de l\'équipe du dresseur:', error);
        });

    imgPokemon_container.className = 'imgPokemon-container';
    infoDresseur_container.appendChild(imgPokemon_container);
    card_container.appendChild(infoDresseur_container);


    return card_container;
}

function ouvrirFenetreAjout() {
    // Création de la div de superposition
    var overlay = document.createElement('div');
    overlay.setAttribute('id', 'overlay');
    overlay.setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999;');

    // Contenu de la fenêtre
    var contenu = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #f2f2f2; border: 4px solid #c62828; border-radius: 10px; padding: 20px; width: 400px; font-family: \'Press Start 2P\', cursive;">';
    contenu += '<span class="fermer" onclick="fermerFenetre()" style="cursor: pointer; position: absolute; top: 5px; right: 10px; font-size: 20px; color: #c62828;">X</span>';
    contenu += '<h2 style="text-align: center; margin-bottom: 20px; font-size: 16px; color: #c62828;">Ajouter un dresseur</h2>';
    contenu += '<form onsubmit="return soumettreFormulaireAjout(event);">';

    // Champs à renseigner
    contenu += '<label style="font-weight: bold;">Nom :</label><br>';
    contenu += '<input type="text" name="name" style="margin-bottom: 10px; padding: 5px; width: 100%;"><br>';
    contenu += '<label style="font-weight: bold;">Description :</label><br>';
    contenu += '<input type="text" name="description" style="margin-bottom: 10px; padding: 5px; width: 100%;"><br>';

    // Bouton de soumission
    contenu += '<input type="submit" value="Soumettre" style="margin-top: 20px; padding: 8px 20px; background-color: #c62828; color: #fff; border: none; border-radius: 4px; font-family: \'Press Start 2P\', cursive; cursor: pointer;">';
    contenu += '</form>';
    contenu += '</div>';

    overlay.innerHTML = contenu;

    // Ajout de la superposition à la page
    document.body.appendChild(overlay);
}

function soumettreFormulaireAjout(event) {
    event.preventDefault();

    var name = document.querySelector('input[name="name"]').value;
    var description = document.querySelector('input[name="description"]').value;

    var body = {
        "name": name,
        "description": description,
    };

    console.log(body);

    fetch('https://pokydexapi.cluster-ig3.igpolytech.fr' + '/dresseur/api/dresseur', {
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
            console.error('Une erreur s\'est produite lors de la création du dresseur:', error);
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
    var contenu = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #f2f2f2; border: 4px solid #c62828; border-radius: 10px; padding: 20px; width: 400px; font-family: \'Press Start 2P\', cursive;">';
    contenu += '<span class="fermer" onclick="fermerFenetre()" style="cursor: pointer; position: absolute; top: 5px; right: 10px; font-size: 20px; color: #c62828;">X</span>';
    contenu += '<h2 style="text-align: center; margin-bottom: 20px; font-size: 16px; color: #c62828;">Ajouter une equipe</h2>';

    // Champs à renseigner
    contenu += '<form onsubmit="return soumettreFormulaireModification(event);">';
    contenu += '<label style="font-weight: bold;">Nom :</label><br>';
    contenu += '<input type="text" name="name" style="margin-bottom: 10px; padding: 5px; width: 100%;"><br>';
    contenu += '<label style="font-weight: bold;">Numéro pokemon 1:</label><br>';
    contenu += '<input type="number" name="numero1" style="margin-bottom: 10px; padding: 5px; width: 100%;"><br>';
    contenu += '<label style="font-weight: bold;">Numéro pokemon 2:</label><br>';
    contenu += '<input type="number" name="numero2" style="margin-bottom: 10px; padding: 5px; width: 100%;"><br>';
    contenu += '<label style="font-weight: bold;">Numéro pokemon 3:</label><br>';
    contenu += '<input type="number" name="numero3" style="margin-bottom: 10px; padding: 5px; width: 100%;"><br>';
    contenu += '<label style="font-weight: bold;">Numéro pokemon 4:</label><br>';
    contenu += '<input type="number" name="numero4" style="margin-bottom: 10px; padding: 5px; width: 100%;"><br>';
    contenu += '<label style="font-weight: bold;">Numéro pokemon 5:</label><br>';
    contenu += '<input type="number" name="numero5" style="margin-bottom: 10px; padding: 5px; width: 100%;"><br>';
    contenu += '<label style="font-weight: bold;">Numéro pokemon 6:</label><br>';
    contenu += '<input type="number" name="numero6" style="margin-bottom: 10px; padding: 5px; width: 100%;"><br>';

    // Bouton de soumission
    contenu += '<input type="submit" value="Soumettre" style="margin-top: 20px; padding: 8px 20px; background-color: #c62828; color: #fff; border: none; border-radius: 4px; font-family: \'Press Start 2P\', cursive; cursor: pointer;">';
    contenu += '</form>';
    contenu += '</div>';

    overlay.innerHTML = contenu;

    // Ajout de la superposition à la page
    document.body.appendChild(overlay);
}

function soumettreFormulaireModification(event) {
    event.preventDefault();

    var name = document.querySelector('input[name="name"]').value;
    var pok1 = document.querySelector('input[name="numero1"]').value;
    var pok2 = document.querySelector('input[name="numero2"]').value;
    var pok3 = document.querySelector('input[name="numero3"]').value;
    var pok4 = document.querySelector('input[name="numero4"]').value;
    var pok5 = document.querySelector('input[name="numero5"]').value;
    var pok6 = document.querySelector('input[name="numero6"]').value;


    var body = {
        "nameDresseur": name,
        "pokemon1": pok1,
        "pokemon2": pok2,
        "pokemon3": pok3,
        "pokemon4": pok4,
        "pokemon5": pok5,
        "pokemon6": pok6
    };

    console.log(body);

    fetch('https://pokydexapi.cluster-ig3.igpolytech.fr' + '/equipe/api/equipe', {
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
            console.error('Une erreur s\'est produite lors de la création du dresseur:', error);
        });

    // Suppression de la superposition de la page
    var overlay = document.getElementById('overlay');
    overlay.parentNode.removeChild(overlay);
}