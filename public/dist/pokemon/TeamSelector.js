import { Token, TokenType } from '../lexer/Token.js';
import { Player } from './Player.js';
import { Pokemon } from './Pokemon.js';
export class TeamSelector {
    constructor(tokens) {
        this.position = 0;
        this.tokens = tokens.filter(token => token.type !== TokenType.WHITESPACE &&
            token.type !== TokenType.NEWLINE &&
            token.type !== TokenType.EOF);
        this.position = 0;
    }
    parsePlayersAndPokemons() {
        const players = [];
        this.position = 0;
        while (this.position < this.tokens.length) {
            try {
                const player = this.parsePlayer();
                if (player) {
                    players.push(player);
                }
            }
            catch (error) {
                console.warn('Error parsing player:', error);
                this.skipToNextPlayer();
            }
        }
        return players;
    }
    parsePlayer() {
        if (!this.match(TokenType.JUGADOR)) {
            this.skipToNextPlayer();
            return null;
        }
        if (!this.match(TokenType.DOS_PUNTOS)) {
            this.skipToNextPlayer();
            return null;
        }
        if (!this.check(TokenType.CADENA_TEXTO)) {
            this.skipToNextPlayer();
            return null;
        }
        let playerName = this.advance().lexeme;
        if (playerName.startsWith('"') && playerName.endsWith('"')) {
            playerName = playerName.slice(1, -1);
        }
        if (!this.match(TokenType.LLAVE_ABRE)) {
            this.skipToNextPlayer();
            return null;
        }
        const player = new Player(playerName);
        while (!this.check(TokenType.LLAVE_CIERRA) && !this.isAtEnd()) {
            const pokemon = this.parsePokemon();
            if (pokemon) {
                player.addPokemon(pokemon);
            }
            else {
                this.skipToNextPokemon();
            }
        }
        if (!this.match(TokenType.LLAVE_CIERRA)) {
            return null;
        }
        return player;
    }
    parsePokemon() {
        if (!this.check(TokenType.CADENA_TEXTO)) {
            return null;
        }
        let pokemonName = this.advance().lexeme;
        if (pokemonName.startsWith('"') && pokemonName.endsWith('"')) {
            pokemonName = pokemonName.slice(1, -1);
        }
        if (!this.match(TokenType.CORCHETE_ABRE)) {
            return null;
        }
        if (!this.isTypeToken(this.peek().type)) {
            return null;
        }
        const pokemonType = this.advance().lexeme;
        if (!this.match(TokenType.CORCHETE_CIERRA)) {
            return null;
        }
        if (!this.match(TokenType.ASIGNACION)) {
            return null;
        }
        if (!this.match(TokenType.PARENTESIS_ABRE)) {
            return null;
        }
        const stats = this.parseStats();
        if (!stats) {
            return null;
        }
        if (!this.match(TokenType.PARENTESIS_CIERRA)) {
            return null;
        }
        return new Pokemon(pokemonName, pokemonType, stats.health, stats.attack, stats.defense);
    }
    parseStats() {
        let health = 0, attack = 0, defense = 0;
        let statsFound = 0;
        while (statsFound < 3 && this.check(TokenType.CORCHETE_ABRE)) {
            if (!this.match(TokenType.CORCHETE_ABRE)) {
                break;
            }
            if (!this.isStatToken(this.peek().type)) {
                return null;
            }
            const statType = this.advance().type;
            if (!this.match(TokenType.CORCHETE_CIERRA)) {
                return null;
            }
            if (!this.match(TokenType.IGUAL)) {
                return null;
            }
            if (!this.check(TokenType.NUMERO)) {
                return null;
            }
            const value = parseInt(this.advance().lexeme);
            if (!this.match(TokenType.PUNTO_COMA)) {
                return null;
            }
            switch (statType) {
                case TokenType.SALUD:
                    health = value;
                    break;
                case TokenType.ATAQUE:
                    attack = value;
                    break;
                case TokenType.DEFENSA:
                    defense = value;
                    break;
                default:
                    return null;
            }
            statsFound++;
        }
        if (statsFound !== 3) {
            return null;
        }
        return { health, attack, defense };
    }
    isTypeToken(tokenType) {
        return [
            TokenType.AGUA,
            TokenType.FUEGO,
            TokenType.PLANTA,
            TokenType.NORMAL,
            TokenType.PSIQUICO,
            TokenType.DRAGON,
            TokenType.BICHO
        ].includes(tokenType);
    }
    isStatToken(tokenType) {
        return [
            TokenType.SALUD,
            TokenType.ATAQUE,
            TokenType.DEFENSA
        ].includes(tokenType);
    }
    match(expectedType) {
        if (this.check(expectedType)) {
            this.advance();
            return true;
        }
        return false;
    }
    check(tokenType) {
        if (this.isAtEnd())
            return false;
        return this.peek().type === tokenType;
    }
    advance() {
        if (!this.isAtEnd())
            this.position++;
        return this.previous();
    }
    isAtEnd() {
        return this.position >= this.tokens.length;
    }
    peek() {
        if (this.isAtEnd()) {
            return new Token(TokenType.EOF, '', 0, 0);
        }
        return this.tokens[this.position];
    }
    previous() {
        return this.tokens[this.position - 1];
    }
    skipToNextPlayer() {
        while (!this.isAtEnd() && this.peek().type !== TokenType.JUGADOR) {
            this.advance();
        }
    }
    skipToNextPokemon() {
        let braceCount = 0;
        while (!this.isAtEnd()) {
            const token = this.peek();
            if (token.type === TokenType.LLAVE_ABRE) {
                braceCount++;
            }
            else if (token.type === TokenType.LLAVE_CIERRA) {
                if (braceCount === 0) {
                    break;
                }
                braceCount--;
            }
            else if (token.type === TokenType.CADENA_TEXTO && braceCount === 0) {
                break;
            }
            this.advance();
        }
    }
}
//# sourceMappingURL=TeamSelector.js.map