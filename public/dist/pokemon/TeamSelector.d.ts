import { Token } from '../lexer/Token.js';
import { Player } from './Player.js';
export declare class TeamSelector {
    private tokens;
    private position;
    constructor(tokens: Token[]);
    parsePlayersAndPokemons(): Player[];
    private parsePlayer;
    private parsePokemon;
    private parseStats;
    private isTypeToken;
    private isStatToken;
    private match;
    private check;
    private advance;
    private isAtEnd;
    private peek;
    private previous;
    private skipToNextPlayer;
    private skipToNextPokemon;
}
