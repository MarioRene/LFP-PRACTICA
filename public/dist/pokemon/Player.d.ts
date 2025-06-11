import { Pokemon } from './Pokemon.js';
export declare class Player {
    name: string;
    pokemons: Pokemon[];
    constructor(name: string);
    addPokemon(pokemon: Pokemon): void;
    getBestTeam(): Pokemon[];
}
