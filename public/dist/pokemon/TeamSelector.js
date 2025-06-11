import { TokenType } from '../lexer/Token.js';
import { Player } from './Player.js';
import { Pokemon } from './Pokemon.js';
export class TeamSelector {
    constructor(tokens) {
        this.position = 0;
        this.tokens = tokens.filter(token => token.type !== TokenType.WHITESPACE &&
            token.type !== TokenType.NEWLINE &&
            token.type !== TokenType.EOF);
        this.position = 0;
        console.log('🎯 TeamSelector initialized with tokens:', this.tokens.length);
    }
    parsePlayersAndPokemons() {
        const players = [];
        this.position = 0;
        while (this.position < this.tokens.length) {
            try {
                const player = this.parsePlayer();
                if (player) {
                    console.log(`✅ Player parsed: ${player.name} with ${player.pokemons.length} Pokemon`);
                    players.push(player);
                }
            }
            catch (error) {
                console.warn('❌ Error parsing player:', error);
                this.skipToNextPlayer();
            }
        }
        return players;
    }
    parsePlayer() {
        if (!this.consumeToken(TokenType.JUGADOR))
            return null;
        if (!this.consumeToken(TokenType.DOS_PUNTOS))
            return null;
        const nameToken = this.consumeToken(TokenType.CADENA_TEXTO);
        if (!nameToken)
            return null;
        let playerName = nameToken.lexeme;
        if (playerName.startsWith('"') && playerName.endsWith('"')) {
            playerName = playerName.slice(1, -1);
        }
        if (!this.consumeToken(TokenType.LLAVE_ABRE))
            return null;
        const player = new Player(playerName);
        console.log(`🔄 Parsing player: ${playerName}`);
        while (!this.checkToken(TokenType.LLAVE_CIERRA) && !this.isAtEnd()) {
            const pokemon = this.parsePokemon();
            if (pokemon) {
                console.log(`  ➕ Pokemon added: ${pokemon.name} [${pokemon.type}] - H:${pokemon.health} A:${pokemon.attack} D:${pokemon.defense}`);
                player.addPokemon(pokemon);
            }
            else {
                console.warn('⚠️  Failed to parse Pokemon, skipping...');
                this.skipToNextPokemon();
            }
        }
        if (!this.consumeToken(TokenType.LLAVE_CIERRA))
            return null;
        return player;
    }
    parsePokemon() {
        const nameToken = this.consumeToken(TokenType.CADENA_TEXTO);
        if (!nameToken)
            return null;
        let pokemonName = nameToken.lexeme;
        if (pokemonName.startsWith('"') && pokemonName.endsWith('"')) {
            pokemonName = pokemonName.slice(1, -1);
        }
        console.log(`🔍 Parsing Pokemon: ${pokemonName}`);
        if (!this.consumeToken(TokenType.CORCHETE_ABRE))
            return null;
        const typeToken = this.consumeTokenOfType('type');
        if (!typeToken)
            return null;
        const pokemonType = typeToken.lexeme;
        if (!this.consumeToken(TokenType.CORCHETE_CIERRA))
            return null;
        if (!this.consumeToken(TokenType.ASIGNACION))
            return null;
        if (!this.consumeToken(TokenType.PARENTESIS_ABRE))
            return null;
        const stats = this.parseStatsBulletproof();
        if (!stats) {
            console.warn('❌ Failed to parse stats for:', pokemonName);
            return null;
        }
        if (!this.consumeToken(TokenType.PARENTESIS_CIERRA))
            return null;
        const pokemon = new Pokemon(pokemonName, pokemonType, stats.health, stats.attack, stats.defense);
        console.log(`  📊 Pokemon created: ${pokemonName} - H:${stats.health} A:${stats.attack} D:${stats.defense} IV:${pokemon.calculateIV().toFixed(1)}%`);
        return pokemon;
    }
    parseStatsBulletproof() {
        console.log('  🔢 Starting bulletproof stats parsing...');
        const stats = {
            health: 0,
            attack: 0,
            defense: 0
        };
        let statsCount = 0;
        const maxStats = 3;
        while (statsCount < maxStats && this.checkToken(TokenType.CORCHETE_ABRE)) {
            console.log(`    📍 Parsing stat ${statsCount + 1}/${maxStats}`);
            if (!this.consumeToken(TokenType.CORCHETE_ABRE)) {
                console.warn('❌ Expected [');
                break;
            }
            const statToken = this.getCurrentToken();
            if (!statToken) {
                console.warn('❌ No stat token found');
                break;
            }
            const statName = statToken.lexeme.toLowerCase();
            console.log(`    📝 Stat name: "${statName}" (type: ${statToken.type})`);
            if (!['salud', 'ataque', 'defensa'].includes(statName)) {
                console.warn(`❌ Invalid stat name: "${statName}"`);
                break;
            }
            this.advance();
            if (!this.consumeToken(TokenType.CORCHETE_CIERRA)) {
                console.warn('❌ Expected ]');
                break;
            }
            if (!this.consumeToken(TokenType.IGUAL)) {
                console.warn('❌ Expected =');
                break;
            }
            const valueToken = this.consumeToken(TokenType.NUMERO);
            if (!valueToken) {
                console.warn('❌ Expected number');
                break;
            }
            const value = parseInt(valueToken.lexeme);
            console.log(`    🔢 Value: ${value}`);
            if (!this.consumeToken(TokenType.PUNTO_COMA)) {
                console.warn('❌ Expected ;');
                break;
            }
            switch (statName) {
                case 'salud':
                    stats.health = value;
                    console.log(`    💚 HEALTH assigned: ${value}`);
                    break;
                case 'ataque':
                    stats.attack = value;
                    console.log(`    ⚔️  ATTACK assigned: ${value}`);
                    break;
                case 'defensa':
                    stats.defense = value;
                    console.log(`    🛡️  DEFENSE assigned: ${value}`);
                    break;
                default:
                    console.warn(`❌ Unknown stat: ${statName}`);
                    break;
            }
            statsCount++;
            console.log(`    ✅ Progress: ${statsCount}/${maxStats} - Current stats: H:${stats.health} A:${stats.attack} D:${stats.defense}`);
        }
        if (statsCount !== maxStats) {
            console.warn(`❌ Expected ${maxStats} stats, got ${statsCount}`);
            return null;
        }
        console.log(`  ✅ Final stats: Health=${stats.health}, Attack=${stats.attack}, Defense=${stats.defense}`);
        if (stats.health === 0 || stats.attack === 0 || stats.defense === 0) {
            console.error(`  🚨 CRITICAL ERROR: Some stats are 0! H:${stats.health} A:${stats.attack} D:${stats.defense}`);
        }
        return stats;
    }
    consumeToken(expectedType) {
        if (this.checkToken(expectedType)) {
            return this.advance();
        }
        console.warn(`❌ Expected ${expectedType}, got ${this.getCurrentToken()?.type || 'EOF'}`);
        return null;
    }
    consumeTokenOfType(category) {
        const currentToken = this.getCurrentToken();
        if (!currentToken)
            return null;
        if (category === 'type' && this.isTypeToken(currentToken.type)) {
            return this.advance();
        }
        console.warn(`❌ Expected ${category} token, got ${currentToken.type}`);
        return null;
    }
    checkToken(tokenType) {
        const current = this.getCurrentToken();
        return current ? current.type === tokenType : false;
    }
    getCurrentToken() {
        if (this.isAtEnd())
            return null;
        return this.tokens[this.position];
    }
    advance() {
        const token = this.getCurrentToken();
        if (!this.isAtEnd())
            this.position++;
        return token;
    }
    isAtEnd() {
        return this.position >= this.tokens.length;
    }
    isTypeToken(tokenType) {
        const validTypes = [
            TokenType.AGUA, TokenType.FUEGO, TokenType.PLANTA,
            TokenType.NORMAL, TokenType.PSIQUICO, TokenType.DRAGON, TokenType.BICHO
        ];
        return validTypes.includes(tokenType);
    }
    skipToNextPlayer() {
        console.log('⏭️  Skipping to next player...');
        while (!this.isAtEnd() && !this.checkToken(TokenType.JUGADOR)) {
            this.advance();
        }
    }
    skipToNextPokemon() {
        console.log('⏭️  Skipping to next Pokemon...');
        let braceCount = 0;
        while (!this.isAtEnd()) {
            const token = this.getCurrentToken();
            if (!token)
                break;
            if (token.type === TokenType.LLAVE_ABRE) {
                braceCount++;
            }
            else if (token.type === TokenType.LLAVE_CIERRA) {
                if (braceCount === 0)
                    break;
                braceCount--;
            }
            else if (token.type === TokenType.CADENA_TEXTO && braceCount === 0) {
                break;
            }
            this.advance();
        }
    }
}
