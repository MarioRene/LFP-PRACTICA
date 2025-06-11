export class Player {
    constructor(name) {
        this.pokemons = [];
        this.name = name;
    }
    addPokemon(pokemon) {
        this.pokemons.push(pokemon);
    }
    getBestTeam() {
        const sortedPokemons = this.pokemons.sort((a, b) => b.calculateIV() - a.calculateIV());
        const selectedTeam = [];
        const usedTypes = new Set();
        for (const pokemon of sortedPokemons) {
            if (selectedTeam.length >= 6)
                break;
            if (!usedTypes.has(pokemon.type)) {
                selectedTeam.push(pokemon);
                usedTypes.add(pokemon.type);
            }
            else if (selectedTeam.length < 6) {
                const existingPokemonOfType = selectedTeam.find(p => p.type === pokemon.type);
                if (existingPokemonOfType && pokemon.calculateIV() > existingPokemonOfType.calculateIV()) {
                    const index = selectedTeam.indexOf(existingPokemonOfType);
                    selectedTeam[index] = pokemon;
                }
            }
        }
        if (selectedTeam.length < 6) {
            for (const pokemon of sortedPokemons) {
                if (selectedTeam.length >= 6)
                    break;
                if (!selectedTeam.includes(pokemon)) {
                    selectedTeam.push(pokemon);
                }
            }
        }
        return selectedTeam.slice(0, 6);
    }
}
