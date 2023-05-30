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

function createDresseur(element) {
    const card_container = document.createElement('div'); 
    card_container.className = 'card-container';
    const imgDresseur_container = document.createElement('div');
    const iconeDresseur = document.createElement('img');
    iconeDresseur.src = 'images/iconeUser.png'
    imgDresseur_container.className = 'imgDresseur-container';
    imgDresseur_container.appendChild(iconeDresseur);
    card_container.appendChild(imgDresseur_container);
    
    const imgPokemon_container = document.createElement('div');
    console.log(element.name);
    fetch('http://localhost:5000' + '/equipe/api/equipe/' + element.name)
        .then(response => response.json())
        .then(data => {
            console.log('Voici l\'équipe du dresseur:', data.nameDresseur);
            console.log(data.pokemon1);
                var img = document.createElement('img');
                img.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + data.pokemon1 +'.png';
                img.alt = 'pokemon';
                img.className = 'card-img';
                card_container.appendChild(img);
                if (data[0].pokemon2 != "undefined"){
                    console.log(data.pokemon2);
                    var img2 = document.createElement('img');
                    img2.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + data[0].pokemon2 +'.png';
                    img2.alt = 'pokemon';
                    img2.className = 'card-img';
                    imgPokemon_container.appendChild(img2);
                }
                if (data[0].pokemon3 != "undefined"){
                    console.log(data.pokemon3);
                    var img3 = document.createElement('img');
                    img3.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + data[0].pokemon3 +'.png';
                    img3.alt = 'pokemon';
                    img3.className = 'card-img';
                    imgPokemon_container.appendChild(img3);
                }
                if (data[0].pokemon4 != "undefined"){
                    console.log(data.pokemon4);
                    var img4 = document.createElement('img');
                    img4.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + data[0].pokemon4 +'.png';
                    img4.alt = 'pokemon';
                    img4.className = 'card-img';
                    imgPokemon_container.appendChild(img4);
                }
                if (data[0].pokemon5 != "undefined"){
                    console.log(data.pokemon5);
                    var img5 = document.createElement('img');
                    img5.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + data[0].pokemon5 +'.png';
                    img5.alt = 'pokemon';
                    img5.className = 'card-img';
                    imgPokemon_container.appendChild(img5);
                }
                if (data[0].pokemon6 != "undefined"){
                    console.log(data.pokemon6);
                    var img6 = document.createElement('img');
                    img6.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + data[0].pokemon6 +'.png';
                    img6.alt = 'pokemon';
                    img6.className = 'card-img';
                    imgPokemon_container.appendChild(img6);
                }
                
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données de l\'équipe du dresseur:', error);
        });

    card_container.appendChild(imgPokemon_container);
    return card_container;
}
