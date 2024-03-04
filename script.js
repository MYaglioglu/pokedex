let pokemonList = [];
let currentOffset = 0;
const limit = 24;
let selectedCard = null;
let currentPokemon;

async function getPokemonList(offset, limit) {
    let url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    let response = await fetch(url);
    let currentPokemon = await response.json();
    return currentPokemon.results;
}

async function loadPokemon(offset, limit) {
    let pokemonData = await getPokemonList(offset, limit);

    for (let i = 0; i < pokemonData.length; i++) {
        let pokemon = await getPokemonDetails(pokemonData[i].url);
        pokemonList.push(pokemon);
        renderPokemonCard(pokemon);
    }
}

async function getPokemonDetails(url) {
    let response = await fetch(url);
    let currentPokemon = await response.json();
    return currentPokemon;
}

function searchPokemon() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const pokedexContainer = document.getElementById('pokedex');
    for (let i = 0; i < pokemonList.length; i++) {
        const pokemonName = pokemonList[i].name.toLowerCase();
        const cardElement = document.getElementsByClassName('pokemonCard')[i];
        if (pokemonName.includes(searchValue)) {
            cardElement.classList.remove('hidden');
        } else {
            cardElement.classList.add('hidden');
        }
    }
    pokedexContainer.classList.add('filtered');
}

function getTypeColor(type) {
    switch (type) {
        case 'grass':
            return '#78C850';
        case 'fire':
            return '#F08030';
        case 'water':
            return '#6890F0';
        case 'bug':
            return '#A8B820';
        case 'normal':
            return '#A8A878';
        case 'poison':
            return '#A040A0';
        case 'electric':
            return '#F8D030';
        case 'ground':
            return '#E0C068';
        case 'fairy':
            return '#EE99AC';
        case 'fighting':
            return '#C03028';
        case 'psychic':
            return '#F85888';
        case 'rock':
            return '#B8A038';
        case 'ghost':
            return '#705898';
        case 'ice':
            return '#98D8D8';
        case 'dragon':
            return '#7038F8';
        case 'steel':
            return '#B8B8D0';
        case 'flying':
            return '#A890F0';
        default:
            return '#000';
    }
}

function renderPokemonCard(pokemon) {
    let card = document.createElement('div');
    card.classList.add('pokemonCard');
    card.style.setProperty('--color1', getTypeColor(pokemon.types[0].type.name));
    if (pokemon.types.length > 1) {
        card.classList.add('dual-type');
        card.style.setProperty('--color2', getTypeColor(pokemon.types[1].type.name));
    } else {
        card.classList.remove('dual-type');
        card.classList.add(pokemon.types[0].type.name);
    }
    let image = document.createElement('img');
    image.classList.add('pokemonImage');
    image.src = pokemon.sprites.front_default;
    card.appendChild(image);
    let name = document.createElement('p');
    name.classList.add('pokemonName');
    name.textContent = pokemon.name;
    card.appendChild(name);
    card.onclick = function() {
        if (selectedCard) {
            selectedCard.classList.remove('selectedCard');
        }   
        selectedCard = card;
        selectedCard.classList.add('selectedCard');
        currentPokemon = pokemon;
        showDetailedPokemon(pokemon);
    };
    pokedex.appendChild(card);
}

function prevPokemon() {
    const currentIndex = pokemonList.indexOf(currentPokemon);

    if (currentIndex > 0) {
        const prevPokemon = pokemonList[currentIndex - 1];
        selectedCard.classList.remove('selectedCard');
        currentPokemon = prevPokemon;
        showDetailedPokemon(currentPokemon);
    }
}

function nextPokemon(){
    const currentIndex = pokemonList.indexOf(currentPokemon);
    if (currentIndex < pokemonList.length - 1) {
        const nextPokemon = pokemonList[currentIndex + 1];
        selectedCard.classList.remove('selectedCard');
        currentPokemon = nextPokemon;     
        showDetailedPokemon(currentPokemon);
    }
}

function renderPokemonInfo(pokemon) {
    document.getElementById('detailedImage').src = pokemon.sprites.front_default;
    document.getElementById('pokeballImage').src = 'img/pokeball.png';
    pokeDetailedCard(pokemon);
    pokeName(pokemon);
    pokeAbout(pokemon);
    pokeMoves(pokemon);            
    pokeStats(pokemon);    
    TypeMid(pokemon);
}

function pokeDetailedCard(pokemon) {
    let detailedCard = document.getElementById('detailedPokemon');
    detailedCard.classList.remove(...detailedCard.classList); // Alle Klassen entfernen
    if (pokemon.types.length > 1) {
        detailedCard.classList.add('dual-type');
        detailedCard.style.setProperty('--color1', getTypeColor(pokemon.types[0].type.name)); 
        detailedCard.style.setProperty('--color2', getTypeColor(pokemon.types[1].type.name));
    } else {
        detailedCard.style.setProperty('--color1', getTypeColor(pokemon.types[0].type.name));
    }  
    detailedCard.classList.add(pokemon.types[0].type.name);
}

function pokeName(pokemon) {
    let name = document.getElementById('detailedName');
    name.innerHTML = `
                    <div class="detailedNameTop">
                        <div class="detailedNameTopLeft">
                            <h2>${pokemon.name}</h2>
                        </div>
                        <div class="detailedNameTopRight">
                            ID# ${pokemon.id}
                        </div>
                    </div>`;
}

function pokeAbout(pokemon) {
    let about = document.getElementById('pokemonAbout');
    let ability = '';
        for (let i = 0; i < pokemon.abilities.length; i++) {
            if (i > 0) {
                ability += ', ';
            }
            ability += pokemon.abilities[i].ability.name;
        }    
    about.innerHTML = ` <div class="statRow">
                            <div>Height: </div> <div>${pokemon.height} feet</div>
                        </div>
                        <div class="statRow">
                            <div>Weight: </div> <div>${pokemon.weight} lbs</div>
                        </div>
                        <div class="statRow">
                            <div>Base Experience:</div> <div>${pokemon.base_experience}</div>
                        </div>

                        <div class="statRow">
                            <div>Abilities:</div><div>${ability}</div>      
                        </div>`;
}

function pokeMoves(pokemon) {
    let moves = document.getElementById('pokemonMoves');
    let movesHTML = '';
        for (let i = 0; i < 5; i++) {
            movesHTML += `
                        <div class="statRow">
                            <div>${pokemon.moves[i].move.name}</div>
                        </div>`;
        }
        moves.innerHTML = movesHTML;
}

function pokeStats(pokemon){
    let stats = document.getElementById('pokemonStats');
    let statsHTML = '';
        for (let i = 0; i < pokemon.stats.length; i++) {
            statsHTML += `
                        <div class="statRow">
                            <div>${pokemon.stats[i].stat.name}:</div>
                            <div>${pokemon.stats[i].base_stat}</div>
                        </div>`;
        }
    stats.innerHTML = statsHTML;
}

function TypeMid(pokemon){
    let typeMid = document.getElementById('typeMid');
    typeMid.innerHTML = '';
    for (let i = 0; i < pokemon.types.length; i++) {
        typeMid.innerHTML += `
        <div id="typeMidType">
          ${pokemon.types[i].type.name}
        </div>
        `; 
    }
}

function showDetailedPokemon(pokemon) {
    renderPokemonInfo(pokemon);
    document.getElementById('detailedPokemon').style.display = 'flex';
    document.querySelector('.modal-overlay').style.display = 'block';
    document.getElementById('pokemonAbout').style.display = 'flex';
    document.getElementById('pokemonMoves').style.display = 'none';
    document.getElementById('pokemonStats').style.display = 'none';
}

function movesBtn() {
    document.getElementById('pokemonAbout').style.display = 'none';
    document.getElementById('pokemonMoves').style.display = 'flex';
    document.getElementById('pokemonStats').style.display = 'none';
}
function aboutBtn() {
    document.getElementById('pokemonAbout').style.display = 'flex';
    document.getElementById('pokemonMoves').style.display = 'none';
    document.getElementById('pokemonStats').style.display = 'none';
}
function statsBtn() {
    document.getElementById('pokemonAbout').style.display = 'none';
    document.getElementById('pokemonMoves').style.display = 'none';
    document.getElementById('pokemonStats').style.display = 'flex';
}

function hideDetailedPokemon() {
    document.getElementById('detailedPokemon').style.display = 'none';
    document.querySelector('.modal-overlay').style.display = 'none';
}

function loadMorePokemon() {
    currentOffset += limit;
    loadPokemon(currentOffset, limit);
}

function initialize() {
    loadPokemon(currentOffset, limit);
    showDetailedPokemon(currentPokemon);
    searchPokemon();
}