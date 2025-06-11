export interface PokemonSprite {
    name: string;
    sprite: string;
}
export declare class PokeAPIService {
    static getPokemonSprite(pokemonName: string): Promise<string>;
    static getPokemonSprites(pokemonNames: string[]): Promise<PokemonSprite[]>;
    static getDefaultSprite(): string;
    static preloadSprite(url: string): Promise<string>;
}
