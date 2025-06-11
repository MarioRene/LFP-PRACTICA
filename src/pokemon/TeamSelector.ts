import { Token, TokenType } from '../lexer/Token.js';
import { Player } from './Player.js';
import { Pokemon } from './Pokemon.js';

export class TeamSelector {
    private tokens: Token[];
    private position: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens.filter(token => 
            token.type !== TokenType.WHITESPACE && 
            token.type !== TokenType.NEWLINE &&
            token.type !== TokenType.EOF
        );
        this.position = 0;
        console.log('🎯 TeamSelector initialized with tokens:', this.tokens.length);
    }

    public parsePlayersAndPokemons(): Player[] {
        const players: Player[] = [];
        this.position = 0;

        while (this.position < this.tokens.length) {
            try {
                const player = this.parsePlayer();
                if (player) {
                    console.log(`✅ Player parsed: ${player.name} with ${player.pokemons.length} Pokemon`);
                    players.push(player);
                }
            } catch (error) {
                console.warn('❌ Error parsing player:', error);
                this.skipToNextPlayer();
            }
        }

        return players;
    }

    private parsePlayer(): Player | null {
        // Encontrar "Jugador"
        if (!this.consumeToken(TokenType.JUGADOR)) return null;
        
        // Encontrar ":"
        if (!this.consumeToken(TokenType.DOS_PUNTOS)) return null;
        
        // Obtener nombre del jugador
        const nameToken = this.consumeToken(TokenType.CADENA_TEXTO);
        if (!nameToken) return null;
        
        let playerName = nameToken.lexeme;
        if (playerName.startsWith('"') && playerName.endsWith('"')) {
            playerName = playerName.slice(1, -1);
        }
        
        // Encontrar "{"
        if (!this.consumeToken(TokenType.LLAVE_ABRE)) return null;

        const player = new Player(playerName);
        console.log(`🔄 Parsing player: ${playerName}`);

        // Parsear Pokemon hasta encontrar "}"
        while (!this.checkToken(TokenType.LLAVE_CIERRA) && !this.isAtEnd()) {
            const pokemon = this.parsePokemon();
            if (pokemon) {
                console.log(`  ➕ Pokemon added: ${pokemon.name} [${pokemon.type}] - H:${pokemon.health} A:${pokemon.attack} D:${pokemon.defense}`);
                player.addPokemon(pokemon);
            } else {
                console.warn('⚠️  Failed to parse Pokemon, skipping...');
                this.skipToNextPokemon();
            }
        }

        // Consumir "}"
        if (!this.consumeToken(TokenType.LLAVE_CIERRA)) return null;

        return player;
    }

    private parsePokemon(): Pokemon | null {
        // Obtener nombre del Pokemon
        const nameToken = this.consumeToken(TokenType.CADENA_TEXTO);
        if (!nameToken) return null;
        
        let pokemonName = nameToken.lexeme;
        if (pokemonName.startsWith('"') && pokemonName.endsWith('"')) {
            pokemonName = pokemonName.slice(1, -1);
        }

        console.log(`🔍 Parsing Pokemon: ${pokemonName}`);

        // Parsear tipo [tipo]
        if (!this.consumeToken(TokenType.CORCHETE_ABRE)) return null;
        
        const typeToken = this.consumeTokenOfType('type');
        if (!typeToken) return null;
        const pokemonType = typeToken.lexeme;
        
        if (!this.consumeToken(TokenType.CORCHETE_CIERRA)) return null;
        
        // Parsear asignación :=
        if (!this.consumeToken(TokenType.ASIGNACION)) return null;
        
        // Parsear estadísticas (...)
        if (!this.consumeToken(TokenType.PARENTESIS_ABRE)) return null;
        
        const stats = this.parseStatsBulletproof();
        if (!stats) {
            console.warn('❌ Failed to parse stats for:', pokemonName);
            return null;
        }
        
        if (!this.consumeToken(TokenType.PARENTESIS_CIERRA)) return null;

        const pokemon = new Pokemon(pokemonName, pokemonType, stats.health, stats.attack, stats.defense);
        console.log(`  📊 Pokemon created: ${pokemonName} - H:${stats.health} A:${stats.attack} D:${stats.defense} IV:${pokemon.calculateIV().toFixed(1)}%`);
        
        return pokemon;
    }

    private parseStatsBulletproof(): { health: number; attack: number; defense: number } | null {
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
            
            // Consumir [
            if (!this.consumeToken(TokenType.CORCHETE_ABRE)) {
                console.warn('❌ Expected [');
                break;
            }

            // Obtener nombre de la estadística
            const statToken = this.getCurrentToken();
            if (!statToken) {
                console.warn('❌ No stat token found');
                break;
            }
            
            const statName = statToken.lexeme.toLowerCase();
            console.log(`    📝 Stat name: "${statName}" (type: ${statToken.type})`);
            
            // Verificar que es una estadística válida
            if (!['salud', 'ataque', 'defensa'].includes(statName)) {
                console.warn(`❌ Invalid stat name: "${statName}"`);
                break;
            }
            
            this.advance(); // Consumir el token de estadística
            
            // Consumir ]
            if (!this.consumeToken(TokenType.CORCHETE_CIERRA)) {
                console.warn('❌ Expected ]');
                break;
            }
            
            // Consumir =
            if (!this.consumeToken(TokenType.IGUAL)) {
                console.warn('❌ Expected =');
                break;
            }
            
            // Obtener valor numérico
            const valueToken = this.consumeToken(TokenType.NUMERO);
            if (!valueToken) {
                console.warn('❌ Expected number');
                break;
            }
            
            const value = parseInt(valueToken.lexeme);
            console.log(`    🔢 Value: ${value}`);
            
            // Consumir ;
            if (!this.consumeToken(TokenType.PUNTO_COMA)) {
                console.warn('❌ Expected ;');
                break;
            }
            
            // ASIGNAR VALOR BASADO EN NOMBRE EXACTO
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
        
        // Verificación final
        if (stats.health === 0 || stats.attack === 0 || stats.defense === 0) {
            console.error(`  🚨 CRITICAL ERROR: Some stats are 0! H:${stats.health} A:${stats.attack} D:${stats.defense}`);
        }
        
        return stats;
    }

    // Métodos helper más robustos
    private consumeToken(expectedType: string): Token | null {
        if (this.checkToken(expectedType)) {
            return this.advance();
        }
        console.warn(`❌ Expected ${expectedType}, got ${this.getCurrentToken()?.type || 'EOF'}`);
        return null;
    }
    
    private consumeTokenOfType(category: string): Token | null {
        const currentToken = this.getCurrentToken();
        if (!currentToken) return null;
        
        if (category === 'type' && this.isTypeToken(currentToken.type)) {
            return this.advance();
        }
        
        console.warn(`❌ Expected ${category} token, got ${currentToken.type}`);
        return null;
    }

    private checkToken(tokenType: string): boolean {
        const current = this.getCurrentToken();
        return current ? current.type === tokenType : false;
    }

    private getCurrentToken(): Token | null {
        if (this.isAtEnd()) return null;
        return this.tokens[this.position];
    }

    private advance(): Token {
        const token = this.getCurrentToken();
        if (!this.isAtEnd()) this.position++;
        return token!;
    }

    private isAtEnd(): boolean {
        return this.position >= this.tokens.length;
    }

    private isTypeToken(tokenType: string): boolean {
        const validTypes = [
            TokenType.AGUA, TokenType.FUEGO, TokenType.PLANTA,
            TokenType.NORMAL, TokenType.PSIQUICO, TokenType.DRAGON, TokenType.BICHO
        ];
        return validTypes.includes(tokenType as TokenType);
    }

    private skipToNextPlayer(): void {
        console.log('⏭️  Skipping to next player...');
        while (!this.isAtEnd() && !this.checkToken(TokenType.JUGADOR)) {
            this.advance();
        }
    }

    private skipToNextPokemon(): void {
        console.log('⏭️  Skipping to next Pokemon...');
        let braceCount = 0;
        
        while (!this.isAtEnd()) {
            const token = this.getCurrentToken();
            if (!token) break;
            
            if (token.type === TokenType.LLAVE_ABRE) {
                braceCount++;
            } else if (token.type === TokenType.LLAVE_CIERRA) {
                if (braceCount === 0) break;
                braceCount--;
            } else if (token.type === TokenType.CADENA_TEXTO && braceCount === 0) {
                break;
            }
            
            this.advance();
        }
    }
}
