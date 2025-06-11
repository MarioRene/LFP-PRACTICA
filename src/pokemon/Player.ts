import { Pokemon } from './Pokemon.js';

export class Player {
    public name: string;
    public pokemons: Pokemon[] = [];

    constructor(name: string) {
        this.name = name;
    }

    public addPokemon(pokemon: Pokemon): void {
        this.pokemons.push(pokemon);
    }

    public getBestTeam(): Pokemon[] {
        const sortedPokemons = this.pokemons.sort((a, b) => b.calculateIV() - a.calculateIV());
        
        const selectedTeam: Pokemon[] = [];
        const usedTypes = new Set<string>();

        // Primero seleccionar por diversidad de tipos
        for (const pokemon of sortedPokemons) {
            if (selectedTeam.length >= 6) break;
            
            if (!usedTypes.has(pokemon.type)) {
                selectedTeam.push(pokemon);
                usedTypes.add(pokemon.type);
            } else if (selectedTeam.length < 6) {
                const existingPokemonOfType = selectedTeam.find(p => p.type === pokemon.type);
                if (existingPokemonOfType && pokemon.calculateIV() > existingPokemonOfType.calculateIV()) {
                    const index = selectedTeam.indexOf(existingPokemonOfType);
                    selectedTeam[index] = pokemon;
                }
            }
        }

        // Completar equipo si hay menos de 6
        if (selectedTeam.length < 6) {
            for (const pokemon of sortedPokemons) {
                if (selectedTeam.length >= 6) break;
                if (!selectedTeam.includes(pokemon)) {
                    selectedTeam.push(pokemon);
                }
            }
        }

        return selectedTeam.slice(0, 6);
    }
}
