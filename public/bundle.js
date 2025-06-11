// public/bundle.js - Archivo Bundle Completo y Corregido
// ============================================================================
// CLASSES AND ENUMS
// ============================================================================

// TokenType Enum
const TokenType = {
    // Palabras reservadas
    JUGADOR: 'Palabra Reservada',
    SALUD: 'Palabra Reservada',
    ATAQUE: 'Palabra Reservada',
    DEFENSA: 'Palabra Reservada',
    
    // Tipos de Pokémon
    AGUA: 'Palabra Reservada',
    FUEGO: 'Palabra Reservada',
    PLANTA: 'Palabra Reservada',
    NORMAL: 'Palabra Reservada',
    PSIQUICO: 'Palabra Reservada',
    DRAGON: 'Palabra Reservada',
    BICHO: 'Palabra Reservada',
    
    // Literales
    CADENA_TEXTO: 'Cadena de Texto',
    NUMERO: 'Número Entero',
    
    // Símbolos
    DOS_PUNTOS: 'Dos Puntos',
    PUNTO_COMA: 'Punto y Coma',
    LLAVE_ABRE: 'Llave Abre',
    LLAVE_CIERRA: 'Llave Cierra',
    CORCHETE_ABRE: 'Corchete Abre',
    CORCHETE_CIERRA: 'Corchete Cierra',
    PARENTESIS_ABRE: 'Paréntesis Abre',
    PARENTESIS_CIERRA: 'Paréntesis Cierra',
    ASIGNACION: 'Asignación',
    IGUAL: 'Igual',
    
    // Especiales
    EOF: 'Fin de Archivo',
    WHITESPACE: 'Espacio en Blanco',
    NEWLINE: 'Nueva Línea'
};

const RESERVED_WORDS = new Map([
    ['Jugador', TokenType.JUGADOR],
    ['salud', TokenType.SALUD],
    ['ataque', TokenType.ATAQUE],
    ['defensa', TokenType.DEFENSA],
    ['agua', TokenType.AGUA],
    ['fuego', TokenType.FUEGO],
    ['planta', TokenType.PLANTA],
    ['normal', TokenType.NORMAL],
    ['psiquico', TokenType.PSIQUICO],
    ['dragon', TokenType.DRAGON],
    ['bicho', TokenType.BICHO]
]);

// Token Class
class Token {
    constructor(type, lexeme, line, column) {
        this.type = type;
        this.lexeme = lexeme;
        this.line = line;
        this.column = column;
    }

    toString() {
        return `Token(${this.type}, "${this.lexeme}", ${this.line}:${this.column})`;
    }
}

// LexicalError Class
class LexicalError {
    constructor(character, line, column, description = 'Carácter desconocido') {
        this.character = character;
        this.line = line;
        this.column = column;
        this.description = description;
    }

    toString() {
        return `Error léxico en línea ${this.line}, columna ${this.column}: '${this.character}' - ${this.description}`;
    }
}

// Lexer Class
class Lexer {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
        this.errors = [];
    }

    analyze() {
        this.tokens = [];
        this.errors = [];
        this.position = 0;
        this.line = 1;
        this.column = 1;

        while (this.position < this.input.length) {
            this.scanToken();
        }

        // Agregar token EOF
        this.tokens.push(new Token(TokenType.EOF, '', this.line, this.column));

        return { tokens: this.tokens, errors: this.errors };
    }

    scanToken() {
        const startLine = this.line;
        const startColumn = this.column;
        const char = this.getCurrentChar();

        // Skip whitespace
        if (this.isWhitespace(char)) {
            this.skipWhitespace();
            return;
        }

        // Single character tokens
        switch (char) {
            case '{':
                this.addToken(TokenType.LLAVE_ABRE, char, startLine, startColumn);
                this.advance();
                return;
            case '}':
                this.addToken(TokenType.LLAVE_CIERRA, char, startLine, startColumn);
                this.advance();
                return;
            case '[':
                this.addToken(TokenType.CORCHETE_ABRE, char, startLine, startColumn);
                this.advance();
                return;
            case ']':
                this.addToken(TokenType.CORCHETE_CIERRA, char, startLine, startColumn);
                this.advance();
                return;
            case '(':
                this.addToken(TokenType.PARENTESIS_ABRE, char, startLine, startColumn);
                this.advance();
                return;
            case ')':
                this.addToken(TokenType.PARENTESIS_CIERRA, char, startLine, startColumn);
                this.advance();
                return;
            case ';':
                this.addToken(TokenType.PUNTO_COMA, char, startLine, startColumn);
                this.advance();
                return;
            case '=':
                this.addToken(TokenType.IGUAL, char, startLine, startColumn);
                this.advance();
                return;
            case ':':
                if (this.peek() === '=') {
                    this.advance();
                    this.advance();
                    this.addToken(TokenType.ASIGNACION, ':=', startLine, startColumn);
                } else {
                    this.addToken(TokenType.DOS_PUNTOS, char, startLine, startColumn);
                    this.advance();
                }
                return;
        }

        // String literals
        if (char === '"') {
            this.scanString(startLine, startColumn);
            return;
        }

        // Numbers
        if (this.isDigit(char)) {
            this.scanNumber(startLine, startColumn);
            return;
        }

        // Identifiers and reserved words
        if (this.isLetter(char)) {
            this.scanIdentifier(startLine, startColumn);
            return;
        }

        // Unknown character
        this.addError(char, this.line, this.column);
        this.advance();
    }

    scanString(startLine, startColumn) {
        this.advance(); // consume opening quote
        let value = '"';

        while (this.position < this.input.length && this.getCurrentChar() !== '"') {
            if (this.getCurrentChar() === '\n' || this.getCurrentChar() === '\r') {
                this.addError('"', startLine, startColumn, 'Cadena sin cerrar');
                return;
            }
            value += this.getCurrentChar();
            this.advance();
        }

        if (this.position >= this.input.length) {
            this.addError('"', startLine, startColumn, 'Cadena sin cerrar');
            return;
        }

        value += this.getCurrentChar();
        this.advance();

        this.addToken(TokenType.CADENA_TEXTO, value, startLine, startColumn);
    }

    scanNumber(startLine, startColumn) {
        let value = '';

        while (this.position < this.input.length && this.isDigit(this.getCurrentChar())) {
            value += this.getCurrentChar();
            this.advance();
        }

        this.addToken(TokenType.NUMERO, value, startLine, startColumn);
    }

    scanIdentifier(startLine, startColumn) {
        let value = '';

        while (this.position < this.input.length && 
               (this.isAlphaNumeric(this.getCurrentChar()) || this.getCurrentChar() === '-')) {
            value += this.getCurrentChar();
            this.advance();
        }

        const tokenType = RESERVED_WORDS.get(value);
        if (tokenType) {
            this.addToken(tokenType, value, startLine, startColumn);
        } else {
            this.addToken(TokenType.CADENA_TEXTO, value, startLine, startColumn);
        }
    }

    skipWhitespace() {
        while (this.position < this.input.length && this.isWhitespace(this.getCurrentChar())) {
            this.advance();
        }
    }

    getCurrentChar() {
        if (this.position >= this.input.length) {
            return '\0';
        }
        return this.input[this.position];
    }

    peek() {
        if (this.position + 1 >= this.input.length) {
            return '\0';
        }
        return this.input[this.position + 1];
    }

    advance() {
        if (this.position < this.input.length) {
            if (this.input[this.position] === '\n') {
                this.line++;
                this.column = 1;
            } else {
                this.column++;
            }
            this.position++;
        }
    }

    isWhitespace(char) {
        return /\s/.test(char);
    }

    isDigit(char) {
        return /[0-9]/.test(char);
    }

    isLetter(char) {
        return /[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(char);
    }

    isAlphaNumeric(char) {
        return this.isLetter(char) || this.isDigit(char);
    }

    addToken(type, lexeme, line, column) {
        this.tokens.push(new Token(type, lexeme, line, column));
    }

    addError(character, line, column, description = 'Carácter desconocido') {
        this.errors.push(new LexicalError(character, line, column, description));
    }
}

// Pokemon Class
class Pokemon {
    constructor(name, type, health, attack, defense) {
        this.name = name;
        this.type = type;
        this.health = health;
        this.attack = attack;
        this.defense = defense;
    }

    calculateIV() {
        return ((this.health + this.attack + this.defense) / 45) * 100;
    }

    toString() {
        return `${this.name} [${this.type}] - IV: ${this.calculateIV().toFixed(2)}%`;
    }
}

// Player Class
class Player {
    constructor(name) {
        this.name = name;
        this.pokemons = [];
    }

    addPokemon(pokemon) {
        this.pokemons.push(pokemon);
    }

    getBestTeam() {
        const sortedPokemons = this.pokemons.sort((a, b) => b.calculateIV() - a.calculateIV());
        
        const selectedTeam = [];
        const usedTypes = new Set();

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

// TeamSelector Class
class TeamSelector {
    constructor(tokens) {
        this.tokens = tokens.filter(token => 
            token.type !== TokenType.WHITESPACE && 
            token.type !== TokenType.NEWLINE &&
            token.type !== TokenType.EOF
        );
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
            } catch (error) {
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
            } else {
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
        if (this.isAtEnd()) return false;
        return this.peek().type === tokenType;
    }

    advance() {
        if (!this.isAtEnd()) this.position++;
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
            } else if (token.type === TokenType.LLAVE_CIERRA) {
                if (braceCount === 0) {
                    break;
                }
                braceCount--;
            } else if (token.type === TokenType.CADENA_TEXTO && braceCount === 0) {
                break;
            }
            
            this.advance();
        }
    }
}

// PokeAPI Service
class PokeAPIService {
    static async getPokemonSprite(pokemonName) {
        try {
            // Normalización especial para nombres de Pokémon
            let normalizedName = pokemonName.toLowerCase().trim();
            
            // Mapeo de nombres especiales
            const nameMapping = {
                'nidoran♀': 'nidoran-f',
                'nidoran♂': 'nidoran-m',
                'mr.mime': 'mr-mime',
                'farfetch\'d': 'farfetchd',
                'ho-oh': 'ho-oh',
                'mime jr.': 'mime-jr',
                'porygon-z': 'porygon-z',
                'jangmo-o': 'jangmo-o',
                'hakamo-o': 'hakamo-o',
                'kommo-o': 'kommo-o',
                'tapu koko': 'tapu-koko',
                'tapu lele': 'tapu-lele',
                'tapu bulu': 'tapu-bulu',
                'tapu fini': 'tapu-fini',
                'type: null': 'type-null',
                'flabébé': 'flabebe',
                'greninja': 'greninja',
                'salamence': 'salamence',
                'torterra': 'torterra',
                'charizard': 'charizard',
                'persian': 'persian',
                'mew': 'mew'
            };

            // Usar mapeo si existe, sino normalizar
            if (nameMapping[normalizedName]) {
                normalizedName = nameMapping[normalizedName];
            } else {
                normalizedName = normalizedName
                    .replace(/[^a-z0-9\-]/g, '-')  // Replace special chars with hyphens
                    .replace(/-+/g, '-')            // Replace multiple hyphens with single
                    .replace(/^-|-$/g, '');         // Remove leading/trailing hyphens
            }

            console.log(`🔍 Fetching sprite for: "${pokemonName}" -> "${normalizedName}"`);
            
            const url = `https://pokeapi.co/api/v2/pokemon/${normalizedName}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                console.warn(`❌ Pokemon ${pokemonName} not found in PokeAPI (${response.status})`);
                return this.getDefaultSprite();
            }

            const data = await response.json();
            
            // Priorizar sprites en este orden
            let sprite = null;
            
            if (data.sprites) {
                // 1. Official artwork (mejor calidad)
                if (data.sprites.other && data.sprites.other['official-artwork'] && data.sprites.other['official-artwork'].front_default) {
                    sprite = data.sprites.other['official-artwork'].front_default;
                }
                // 2. Sprite por defecto
                else if (data.sprites.front_default) {
                    sprite = data.sprites.front_default;
                }
                // 3. Otros sprites disponibles
                else if (data.sprites.other && data.sprites.other['home'] && data.sprites.other['home'].front_default) {
                    sprite = data.sprites.other['home'].front_default;
                }
            }

            if (sprite) {
                console.log(`✅ Sprite found for ${pokemonName}:`, sprite);
                return sprite;
            } else {
                console.warn(`⚠️ No sprite available for ${pokemonName}`);
                return this.getDefaultSprite();
            }
            
        } catch (error) {
            console.error(`💥 Error fetching sprite for ${pokemonName}:`, error);
            return this.getDefaultSprite();
        }
    }

    static async getPokemonSprites(pokemonNames) {
        console.log(`🎯 Fetching sprites for ${pokemonNames.length} Pokemon:`, pokemonNames);
        
        const results = [];
        
        // Procesar uno por uno para mejor debugging y evitar rate limiting
        for (const name of pokemonNames) {
            try {
                const sprite = await this.getPokemonSprite(name);
                results.push({ name, sprite });
                
                // Pequeña pausa para evitar rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Error processing ${name}:`, error);
                results.push({ name, sprite: this.getDefaultSprite() });
            }
        }

        console.log(`📊 Sprites fetch completed. ${results.length} results.`);
        return results;
    }

    static getDefaultSprite() {
        // SVG mejorado como fallback
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI2Y4ZjRmZiIgc3Ryb2tlPSIjOWI1OWI2IiBzdHJva2Utd2lkdGg9IjMiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZThkNWYyIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSI1MCIgeT0iNTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMCIgZmlsbD0iIzliNTliNiI+8J+StzwvdGV4dD4KPC9zdmc+';
    }

    // Método para pre-cargar sprites (opcional)
    static async preloadSprite(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
            img.src = url;
        });
    }
}

// Report Generators
class TokenReport {
    static generateHTML(tokens) {
        const filteredTokens = tokens.filter(token => 
            token.type !== 'Espacio en Blanco' && 
            token.type !== 'Nueva Línea' && 
            token.type !== 'Fin de Archivo'
        );

        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Tokens</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: linear-gradient(135deg, #f8f4ff 0%, #e8d5f2 100%); }
        h1 { color: #9b59b6; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(155, 89, 182, 0.15); }
        th, td { border: 1px solid #e8d5f2; padding: 12px; text-align: left; }
        th { background: #9b59b6; color: white; }
        tr:nth-child(even) { background: #f8f4ff; }
        .numero { text-align: center; }
    </style>
</head>
<body>
    <h1>📊 Reporte de Tokens</h1>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Fila</th>
                <th>Columna</th>
                <th>Lexema</th>
                <th>Token</th>
            </tr>
        </thead>
        <tbody>
            ${filteredTokens.map((token, i) => `
                <tr>
                    <td class="numero">${i + 1}</td>
                    <td class="numero">${token.line}</td>
                    <td class="numero">${token.column}</td>
                    <td><code>${token.lexeme}</code></td>
                    <td>${token.type}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>`;
    }
}

class ErrorReport {
    static generateHTML(errors) {
        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Errores Léxicos</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: linear-gradient(135deg, #f8f4ff 0%, #e8d5f2 100%); }
        h1 { color: #e74c3c; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(231, 76, 60, 0.15); }
        th, td { border: 1px solid #ffebee; padding: 12px; text-align: left; }
        th { background: #e74c3c; color: white; }
        tr:nth-child(even) { background: #ffebee; }
        .numero { text-align: center; }
        .character { font-family: monospace; font-weight: bold; color: #e74c3c; }
        .no-errors { text-align: center; color: #27ae60; font-size: 18px; }
    </style>
</head>
<body>
    <h1>❌ Reporte de Errores Léxicos</h1>
    ${errors.length === 0 ? 
        '<p class="no-errors">✅ ¡No se encontraron errores léxicos!</p>' :
        `<table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Fila</th>
                    <th>Columna</th>
                    <th>Carácter</th>
                    <th>Descripción</th>
                </tr>
            </thead>
            <tbody>
                ${errors.map((error, i) => `
                    <tr>
                        <td class="numero">${i + 1}</td>
                        <td class="numero">${error.line}</td>
                        <td class="numero">${error.column}</td>
                        <td class="character">${error.character}</td>
                        <td>${error.description}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`
    }
</body>
</html>`;
    }
}

class TeamReport {
    static async generateHTML(players) {
        console.log(`🎮 Generating team report for ${players.length} players...`);
        
        let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Equipos Pokémon</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background: linear-gradient(135deg, #f8f4ff 0%, #e8d5f2 100%);
            color: #2c3e50;
        }
        h1 { 
            color: #9b59b6; 
            text-align: center; 
            margin-bottom: 2rem;
            font-size: 2.5rem;
        }
        .summary {
            background: white;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
            border: 2px solid #e8d5f2;
            box-shadow: 0 4px 15px rgba(155, 89, 182, 0.15);
        }
        .stats-summary {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 1.5rem;
        }
        .stat-item {
            text-align: center;
            padding: 1rem;
            background: #e8d5f2;
            border-radius: 15px;
            min-width: 120px;
        }
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #9b59b6;
        }
        .stat-label {
            font-size: 0.9rem;
            color: #7f8c8d;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .player-section { 
            background: white; 
            margin: 30px 0; 
            padding: 20px; 
            border-radius: 15px; 
            box-shadow: 0 8px 25px rgba(155, 89, 182, 0.15);
            border: 2px solid #e8d5f2;
            position: relative;
            overflow: hidden;
        }
        .player-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, #9b59b6, #7d3c98, #9b59b6);
        }
        .player-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e8d5f2;
        }
        .player-name { 
            color: #9b59b6; 
            font-size: 2rem; 
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .player-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #9b59b6, #7d3c98);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
        }
        .team-stats {
            text-align: right;
            color: #7f8c8d;
        }
        .team-count {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }
        .avg-iv {
            font-size: 1.3rem;
            font-weight: bold;
            color: #9b59b6;
        }
        .pokemon-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
            gap: 25px; 
        }
        .pokemon-card { 
            background: linear-gradient(135deg, #fff 0%, #f8f4ff 100%);
            border: 3px solid #e8d5f2; 
            border-radius: 20px; 
            padding: 25px; 
            text-align: center; 
            transition: all 0.4s ease;
            box-shadow: 0 8px 25px rgba(155, 89, 182, 0.1);
            position: relative;
            overflow: hidden;
        }
        .pokemon-card:hover { 
            transform: translateY(-10px) scale(1.02); 
            border-color: #9b59b6;
            box-shadow: 0 20px 40px rgba(155, 89, 182, 0.25);
        }
        .pokemon-image { 
            width: 120px; 
            height: 120px; 
            margin: 0 auto 20px; 
            display: block; 
            border-radius: 50%;
            border: 4px solid #e8d5f2;
            background: white;
            object-fit: contain;
            transition: all 0.3s ease;
            position: relative;
            z-index: 1;
        }
        .pokemon-card:hover .pokemon-image {
            border-color: #9b59b6;
            transform: scale(1.1);
        }
        .pokemon-name { 
            font-weight: bold; 
            color: #2c3e50; 
            margin: 15px 0; 
            font-size: 1.3rem;
            text-transform: capitalize;
        }
        .pokemon-type { 
            color: white; 
            padding: 8px 15px; 
            border-radius: 20px; 
            font-size: 0.9rem; 
            margin: 10px auto;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: inline-block;
            min-width: 100px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .pokemon-stats-container {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            background: #f8f4ff;
            padding: 15px;
            border-radius: 15px;
        }
        .stat {
            text-align: center;
            flex: 1;
        }
        .stat-label {
            color: #7f8c8d;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        .stat-value {
            font-weight: bold;
            color: #2c3e50;
            font-size: 1.3rem;
        }
        .pokemon-iv { 
            background: linear-gradient(135deg, #9b59b6, #7d3c98);
            color: white;
            font-weight: bold; 
            font-size: 1.3rem;
            margin-top: 15px;
            padding: 12px 20px;
            border-radius: 25px;
            display: inline-block;
            min-width: 120px;
            box-shadow: 0 6px 20px rgba(155, 89, 182, 0.3);
        }
        .rank-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background: #9b59b6;
            color: white;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.1rem;
            z-index: 2;
        }
        .type-agua { background: linear-gradient(135deg, #3498db, #2980b9); }
        .type-fuego { background: linear-gradient(135deg, #e74c3c, #c0392b); }
        .type-planta { background: linear-gradient(135deg, #27ae60, #229954); }
        .type-normal { background: linear-gradient(135deg, #95a5a6, #7f8c8d); }
        .type-psiquico { background: linear-gradient(135deg, #e91e63, #ad1457); }
        .type-dragon { background: linear-gradient(135deg, #9b59b6, #8e44ad); }
        .type-bicho { background: linear-gradient(135deg, #8bc34a, #689f38); }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 30px;
            background: white;
            border-radius: 20px;
            border: 2px solid #e8d5f2;
            box-shadow: 0 10px 30px rgba(155, 89, 182, 0.15);
        }
        .footer-text {
            color: #7f8c8d;
            font-size: 1.1rem;
            margin-bottom: 10px;
        }
        .university-info {
            color: #9b59b6;
            font-weight: 600;
            font-size: 1rem;
        }
        .loading-sprite {
            width: 120px;
            height: 120px;
            background: #f8f4ff;
            border: 4px solid #e8d5f2;
            border-top: 4px solid #9b59b6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="summary">
        <h1>🏆 Equipos Pokémon Seleccionados</h1>
        <p style="font-size: 1.2rem; color: #7f8c8d;">
            Los mejores equipos han sido seleccionados basándose en los IV's más altos,<br>
            priorizando la diversidad de tipos para una estrategia balanceada.
        </p>
        <div class="stats-summary">
            <div class="stat-item">
                <div class="stat-number">${players.length}</div>
                <div class="stat-label">Jugadores</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${players.reduce((total, player) => total + player.getBestTeam().length, 0)}</div>
                <div class="stat-label">Pokémon Total</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${this.calculateOverallAverageIV(players).toFixed(1)}%</div>
                <div class="stat-label">IV Promedio</div>
            </div>
        </div>
    </div>`;

        // Procesar cada jugador
        for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
            const player = players[playerIndex];
            const team = player.getBestTeam();
            const averageIV = team.reduce((sum, pokemon) => sum + pokemon.calculateIV(), 0) / team.length;
            
            console.log(`👤 Processing player: ${player.name} with ${team.length} Pokemon`);
            
            html += `
    <div class="player-section">
        <div class="player-header">
            <div class="player-name">
                <div class="player-icon">👤</div>
                ${player.name}
            </div>
            <div class="team-stats">
                <div class="team-count">Equipo de ${team.length} Pokémon</div>
                <div class="avg-iv">IV Promedio: ${averageIV.toFixed(1)}%</div>
            </div>
        </div>
        <div class="pokemon-grid">`;

            // Obtener sprites para todos los pokemon del equipo
            console.log(`🔄 Fetching sprites for team: ${team.map(p => p.name).join(', ')}`);
            const pokemonNames = team.map(p => p.name);
            const sprites = await PokeAPIService.getPokemonSprites(pokemonNames);
            console.log(`📦 Received ${sprites.length} sprites for ${player.name}`);

            team.forEach((pokemon, index) => {
                const sprite = sprites[index]?.sprite || PokeAPIService.getDefaultSprite();
                const iv = pokemon.calculateIV();
                
                console.log(`🎨 Rendering ${pokemon.name} with sprite: ${sprite.substring(0, 50)}...`);
                
                html += `
            <div class="pokemon-card">
                <div class="rank-badge">${index + 1}</div>
                <img src="${sprite}" 
                     alt="${pokemon.name}" 
                     class="pokemon-image" 
                     onerror="console.error('Failed to load sprite for ${pokemon.name}'); this.src='${PokeAPIService.getDefaultSprite()}';"
                     onload="console.log('✅ Successfully loaded sprite for ${pokemon.name}');">
                <div class="pokemon-name">${pokemon.name}</div>
                <div class="pokemon-type type-${pokemon.type}">${pokemon.type}</div>
                <div class="pokemon-stats-container">
                    <div class="stat">
                        <div class="stat-label">💚 Salud</div>
                        <div class="stat-value">${pokemon.health}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">⚔️ Ataque</div>
                        <div class="stat-value">${pokemon.attack}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">🛡️ Defensa</div>
                        <div class="stat-value">${pokemon.defense}</div>
                    </div>
                </div>
                <div class="pokemon-iv">
                    📈 IV: ${iv.toFixed(1)}%
                </div>
            </div>`;
            });

            html += `
        </div>
    </div>`;
        }

        html += `
    <div class="footer">
        <div class="footer-text">
            ⚡ Análisis completado exitosamente • ${new Date().toLocaleDateString('es-ES')}
        </div>
        <div class="university-info">
            🎓 Universidad de San Carlos de Guatemala<br>
            Facultad de Ingeniería • Lenguajes Formales y de Programación<br>
            Vacaciones de Junio 2025
        </div>
    </div>
</body>
</html>`;

        console.log(`✅ Team report HTML generated successfully!`);
        return html;
    }

    static calculateOverallAverageIV(players) {
        let totalIV = 0;
        let totalPokemon = 0;

        for (const player of players) {
            const team = player.getBestTeam();
            for (const pokemon of team) {
                totalIV += pokemon.calculateIV();
                totalPokemon++;
            }
        }

        return totalPokemon > 0 ? totalIV / totalPokemon : 0;
    }
}

// FileHandler Class
class FileHandler {
    static loadFile() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pklfp';
            
            input.onchange = (event) => {
                const target = event.target;
                const file = target.files?.[0];
                if (!file) {
                    reject(new Error('No file selected'));
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result;
                    if (typeof result === 'string') {
                        resolve(result);
                    } else {
                        reject(new Error('Failed to read file as text'));
                    }
                };
                reader.onerror = () => reject(new Error('Error reading file'));
                reader.readAsText(file);
            };

            input.click();
        });
    }

    static saveFile(content, filename = 'pokemon-team.pklfp') {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
}

// ============================================================================
// MAIN APPLICATION
// ============================================================================

class PokemonLexerApp {
    constructor() {
        this.currentTokens = [];
        this.currentErrors = [];
        this.currentTeams = [];
        this.initializeApp();
    }

    initializeApp() {
        this.setupMonacoEditor();
        
        setTimeout(() => {
            this.setupEventListeners();
        }, 1000);
    }

    setupMonacoEditor() {
        if (!window.require) {
            console.error('Monaco Editor loader no está disponible');
            return;
        }

        window.require.config({ 
            paths: { 
                vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' 
            }
        });

        window.require(['vs/editor/editor.main'], () => {
            window.monaco.languages.register({ id: 'pokemon' });
            
            window.monaco.languages.setMonarchTokensProvider('pokemon', {
                tokenizer: {
                    root: [
                        [/Jugador|salud|ataque|defensa|agua|fuego|planta|normal|psiquico|dragon|bicho/, 'keyword'],
                        [/"[^"]*"/, 'string'],
                        [/\d+/, 'number'],
                        [/[{}[\]():;=]/, 'delimiter'],
                        [/:=/, 'operator'],
                        [/\s+/, 'white']
                    ]
                }
            });

            window.monaco.editor.defineTheme('pokemon-theme', {
                base: 'vs',
                inherit: true,
                rules: [
                    { token: 'keyword', foreground: '9b59b6', fontStyle: 'bold' },
                    { token: 'string', foreground: 'e67e22' },
                    { token: 'number', foreground: '8e44ad' },
                    { token: 'delimiter', foreground: '34495e' },
                    { token: 'operator', foreground: '2c3e50', fontStyle: 'bold' }
                ],
                colors: {
                    'editor.background': '#ffffff',
                    'editor.lineHighlightBackground': '#f8f4ff'
                }
            });

            window.editor = window.monaco.editor.create(document.getElementById('editor'), {
                value: this.getSampleCode(),
                language: 'pokemon',
                theme: 'pokemon-theme',
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                minimap: { enabled: false },
                wordWrap: 'on',
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3
            });

            window.editor.onDidChangeModelContent(() => {
                this.updateStatusBar();
            });

            this.updateStatusBar();
        });
    }

    getSampleCode() {
        return `Jugador: "PokeEvee" {
    "venusaur"[planta] := (
        [salud]=12;
        [ataque]=11;
        [defensa]=15;
    )
    "dragonite"[dragon] := (
        [salud]=10;
        [ataque]=15;
        [defensa]=14;
    )
    "butterfree"[bicho] := (
        [salud]=14;
        [ataque]=13;
        [defensa]=15;
    )
    "snorlax"[normal] := (
        [salud]=15;
        [ataque]=12;
        [defensa]=14;
    )
    "victreebel"[planta] := (
        [salud]=15;
        [ataque]=14;
        [defensa]=14;
    )
    "flareon"[fuego] := (
        [salud]=12;
        [ataque]=15;
        [defensa]=14;
    )
}`;
    }

    setupEventListeners() {
        // Botones principales
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analyzeCode());
        }

        const clearBtn = document.getElementById('clearEditor');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearEditor());
        }

        const loadBtn = document.getElementById('loadFile');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => this.loadFile());
        }

        const saveBtn = document.getElementById('saveFile');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveFile());
        }

        // Botones de reportes
        const tokenReportBtn = document.getElementById('tokenReport');
        if (tokenReportBtn) {
            tokenReportBtn.addEventListener('click', () => this.showTokenReport());
        }

        const errorReportBtn = document.getElementById('errorReport');
        if (errorReportBtn) {
            errorReportBtn.addEventListener('click', () => this.showErrorReport());
        }

        const teamReportBtn = document.getElementById('teamReport');
        if (teamReportBtn) {
            teamReportBtn.addEventListener('click', () => this.showTeamReport());
        }

        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                if (tabName) this.switchTab(tabName);
            });
        });

        // File input
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileLoad(e));
        }
    }

    async analyzeCode() {
        const code = this.getEditorValue();
        
        if (!code.trim()) {
            this.showStatus('Por favor, ingrese código para analizar.', 'warning');
            return;
        }

        this.showLoading(true);

        try {
            const lexer = new Lexer(code);
            const { tokens, errors } = lexer.analyze();

            this.currentTokens = tokens;
            this.currentErrors = errors;

            console.log('Tokens encontrados:', tokens.length);
            console.log('Errores encontrados:', errors.length);

            this.updateTokensTable();
            this.updateErrorsTable();
            this.updateStatusBar();

            if (errors.length > 0) {
                this.switchTab('errors');
                this.showStatus(`Análisis completado con ${errors.length} error(es) léxico(s).`, 'error');
                this.currentTeams = [];
                this.updateTeamsDisplay();
                
                const errorReportHTML = ErrorReport.generateHTML(errors);
                this.openReportWindow(errorReportHTML, 'Reporte de Errores Léxicos');
            } else {
                const teamSelector = new TeamSelector(tokens);
                const players = teamSelector.parsePlayersAndPokemons();
                this.currentTeams = players;

                console.log('Jugadores procesados:', players.length);

                if (players.length > 0) {
                    this.updateTeamsDisplay();
                    this.switchTab('teams');
                    this.showStatus(`Análisis completado exitosamente. ${players.length} jugador(es) procesado(s).`, 'success');
                    
                    const teamReportHTML = await TeamReport.generateHTML(players);
                    this.openReportWindow(teamReportHTML, 'Equipos Pokémon');
                } else {
                    this.switchTab('tokens');
                    this.showStatus('No se encontraron jugadores válidos en el código.', 'warning');
                }

                const tokenReportHTML = TokenReport.generateHTML(tokens);
                this.openReportWindow(tokenReportHTML, 'Reporte de Tokens');
            }

        } catch (error) {
            console.error('Error durante el análisis:', error);
            this.showStatus('Error durante el análisis del código.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    clearEditor() {
        if (window.editor) {
            window.editor.setValue('');
            this.currentTokens = [];
            this.currentErrors = [];
            this.currentTeams = [];
            this.updateStatusBar();
            this.updateTokensTable();
            this.updateErrorsTable();
            this.updateTeamsDisplay();
            this.showStatus('Editor limpiado.', 'info');
        }
    }

    async loadFile() {
        try {
            const content = await FileHandler.loadFile();
            if (window.editor) {
                window.editor.setValue(content);
                this.showStatus('Archivo cargado exitosamente.', 'success');
            }
        } catch (error) {
            console.error('Error cargando archivo:', error);
            this.showStatus('Error al cargar el archivo.', 'error');
        }
    }

    saveFile() {
        const content = this.getEditorValue();
        if (!content.trim()) {
            this.showStatus('No hay contenido para guardar.', 'warning');
            return;
        }

        FileHandler.saveFile(content);
        this.showStatus('Archivo guardado exitosamente.', 'success');
    }

    showTokenReport() {
        if (this.currentTokens.length === 0) {
            this.showStatus('No hay tokens para mostrar. Ejecute el análisis primero.', 'warning');
            return;
        }

        const reportHTML = TokenReport.generateHTML(this.currentTokens);
        this.openReportWindow(reportHTML, 'Reporte de Tokens');
    }

    showErrorReport() {
        const reportHTML = ErrorReport.generateHTML(this.currentErrors);
        this.openReportWindow(reportHTML, 'Reporte de Errores Léxicos');
    }

    async showTeamReport() {
        if (this.currentTokens.length === 0) {
            this.showStatus('No hay datos para mostrar. Ejecute el análisis primero.', 'warning');
            return;
        }

        if (this.currentErrors.length > 0) {
            this.showStatus('No se puede generar el reporte de equipos debido a errores léxicos.', 'error');
            return;
        }

        if (this.currentTeams.length === 0) {
            this.showStatus('No hay equipos válidos para mostrar.', 'warning');
            return;
        }

        try {
            this.showLoading(true);
            const reportHTML = await TeamReport.generateHTML(this.currentTeams);
            this.openReportWindow(reportHTML, 'Equipos Pokémon');
        } catch (error) {
            console.error('Error generando reporte de equipos:', error);
            this.showStatus('Error al generar el reporte de equipos.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    openReportWindow(htmlContent, title) {
        const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        if (newWindow) {
            newWindow.document.write(htmlContent);
            newWindow.document.title = title;
            newWindow.document.close();
        } else {
            this.downloadReport(htmlContent, title);
            this.showStatus('El navegador bloqueó la ventana emergente. Descargando archivo...', 'info');
        }
    }

    downloadReport(htmlContent, title) {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetTab) targetTab.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const targetContent = document.getElementById(`${tabName}-tab`);
        if (targetContent) targetContent.classList.add('active');
    }

    updateTokensTable() {
        const container = document.getElementById('tokens-table');
        const empty = document.getElementById('tokens-empty');
        
        if (!container || !empty) return;

        if (this.currentTokens.length === 0) {
            container.style.display = 'none';
            empty.style.display = 'block';
            return;
        }
        
        empty.style.display = 'none';
        container.style.display = 'block';
        
        const getTokenClass = (type) => {
            if (type.includes('Reservada')) return 'token-reserved';
            if (type.includes('Texto')) return 'token-string';
            if (type.includes('Número')) return 'token-number';
            return 'token-symbol';
        };
        
        const filteredTokens = this.currentTokens.filter(token => 
            token.type !== 'Espacio en Blanco' && 
            token.type !== 'Nueva Línea' && 
            token.type !== 'Fin de Archivo'
        );
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Línea</th>
                        <th>Columna</th>
                        <th>Lexema</th>
                        <th>Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredTokens.map((token, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${token.line}</td>
                            <td>${token.column}</td>
                            <td><code>${this.escapeHtml(token.lexeme)}</code></td>
                            <td><span class="token-type ${getTokenClass(token.type)}">${token.type}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    updateErrorsTable() {
        const container = document.getElementById('errors-table');
        const empty = document.getElementById('errors-empty');
        
        if (!container || !empty) return;

        if (this.currentErrors.length === 0) {
            container.style.display = 'none';
            empty.style.display = 'block';
            return;
        }
        
        empty.style.display = 'none';
        container.style.display = 'block';
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Línea</th>
                        <th>Columna</th>
                        <th>Carácter</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.currentErrors.map((error, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${error.line}</td>
                            <td>${error.column}</td>
                            <td><span class="error-char">${this.escapeHtml(error.character)}</span></td>
                            <td>${error.description}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    async updateTeamsDisplay() {
        const container = document.getElementById('teams-content');
        const empty = document.getElementById('teams-empty');
        
        if (!container || !empty) return;

        if (this.currentTeams.length === 0 || this.currentErrors.length > 0) {
            container.style.display = 'none';
            empty.style.display = 'block';
            return;
        }
        
        empty.style.display = 'none';
        container.style.display = 'block';
        
        try {
            console.log(`🎮 Updating teams display for ${this.currentTeams.length} players...`);
            let html = '';
            
            for (const player of this.currentTeams) {
                const team = player.getBestTeam();
                
                html += `
                    <div style="margin-bottom: 2rem; padding: 1.5rem; border: 2px solid var(--accent); border-radius: 15px; background: linear-gradient(135deg, #fff 0%, var(--secondary) 100%);">
                        <h3 style="color: var(--primary); margin-bottom: 1rem; text-align: center; font-size: 1.3rem;">
                            <i class="fas fa-user"></i> ${player.name}
                        </h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
                `;

                // Get sprites for the team with improved handling
                console.log(`🔄 Fetching sprites for ${player.name}: ${team.map(p => p.name).join(', ')}`);
                const pokemonNames = team.map(p => p.name);
                const sprites = await PokeAPIService.getPokemonSprites(pokemonNames);
                console.log(`📦 Received sprites for ${player.name}:`, sprites.map(s => s.name));

                team.forEach((pokemon, index) => {
                    const iv = pokemon.calculateIV();
                    const sprite = sprites[index]?.sprite || PokeAPIService.getDefaultSprite();
                    
                    console.log(`🎨 Rendering ${pokemon.name} with sprite: ${sprite.substring(0, 50)}...`);
                    
                    html += `
                        <div style="text-align: center; padding: 1rem; background: white; border-radius: 10px; border: 1px solid var(--border); box-shadow: 0 2px 8px var(--shadow);">
                            <img src="${sprite}" 
                                 alt="${pokemon.name}" 
                                 style="width: 80px; height: 80px; margin: 0 auto; border-radius: 50%; border: 2px solid var(--accent); background: white; object-fit: contain; margin-bottom: 0.5rem;"
                                 onerror="console.error('Preview: Failed to load sprite for ${pokemon.name}'); this.src='${PokeAPIService.getDefaultSprite()}';"
                                 onload="console.log('Preview: ✅ Successfully loaded sprite for ${pokemon.name}');">
                            <h4 style="margin: 0.5rem 0; color: var(--text-dark); font-size: 1rem;">${pokemon.name}</h4>
                            <div style="background: var(--primary); color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; margin: 0.5rem 0; display: inline-block;">
                                ${pokemon.type}
                            </div>
                            <div style="color: var(--primary); font-weight: bold; font-size: 0.9rem;">
                                IV: ${iv.toFixed(1)}%
                            </div>
                            <div style="font-size: 0.8rem; color: var(--text-light); margin-top: 0.3rem;">
                                S:${pokemon.health} A:${pokemon.attack} D:${pokemon.defense}
                            </div>
                        </div>
                    `;
                });

                html += `</div></div>`;
            }
            
            container.innerHTML = html;
            console.log(`✅ Teams display updated successfully!`);
            
        } catch (error) {
            console.error('💥 Error generando vista previa de equipos:', error);
            container.innerHTML = '<p style="text-align: center; color: var(--error);">Error al generar vista previa de equipos</p>';
        }
    }

    updateStatusBar() {
        const lineCountEl = document.getElementById('line-count');
        const tokenCountEl = document.getElementById('token-count');
        const errorCountEl = document.getElementById('error-count');
        
        if (lineCountEl && window.editor) {
            const model = window.editor.getModel();
            const lineCount = model ? model.getLineCount() : 0;
            lineCountEl.textContent = `Líneas: ${lineCount}`;
        }
        
        if (tokenCountEl) {
            tokenCountEl.textContent = `Tokens: ${this.currentTokens.length}`;
        }
        
        if (errorCountEl) {
            errorCountEl.textContent = `Errores: ${this.currentErrors.length}`;
        }
    }

    showLoading(show) {
        const loadingEl = document.getElementById('loading');
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        if (loadingEl) {
            loadingEl.style.display = show ? 'flex' : 'none';
        }
        
        if (analyzeBtn) {
            analyzeBtn.disabled = show;
            analyzeBtn.innerHTML = show 
                ? '<i class="fas fa-spinner fa-spin"></i> Analizando...' 
                : '<i class="fas fa-play"></i> Analizar';
        }
    }

    showStatus(message, type) {
        const statusEl = document.getElementById('status-message');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `status-message ${type}`;
            statusEl.style.display = 'block';

            setTimeout(() => {
                statusEl.style.display = 'none';
            }, 5000);
        }
    }

    getEditorValue() {
        return window.editor ? window.editor.getValue() : '';
    }

    handleFileLoad(event) {
        const input = event.target;
        const file = input.files?.[0];
        
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result;
            if (window.editor) {
                window.editor.setValue(content);
                this.showStatus('Archivo cargado exitosamente.', 'success');
            }
        };
        reader.onerror = () => {
            this.showStatus('Error al leer el archivo.', 'error');
        };
        reader.readAsText(file);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new PokemonLexerApp();
});
