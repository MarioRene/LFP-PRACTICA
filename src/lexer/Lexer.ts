import { Token, TokenType, RESERVED_WORDS } from './Token.js';
import { LexicalError } from './LexicalError.js';

export interface AnalysisResult {
    tokens: Token[];
    errors: LexicalError[];
}

export class Lexer {
    private input: string;
    private position: number = 0;
    private line: number = 1;
    private column: number = 1;
    private tokens: Token[] = [];
    private errors: LexicalError[] = [];

    constructor(input: string) {
        this.input = input;
    }

    public analyze(): AnalysisResult {
        this.tokens = [];
        this.errors = [];
        this.position = 0;
        this.line = 1;
        this.column = 1;

        console.log('🔍 Starting lexical analysis...');

        while (this.position < this.input.length) {
            this.scanToken();
        }

        // Agregar token EOF
        this.tokens.push(new Token(TokenType.EOF, '', this.line, this.column));

        console.log(`✅ Lexical analysis completed. Tokens: ${this.tokens.length}, Errors: ${this.errors.length}`);
        
        // Debug: mostrar algunos tokens importantes
        const importantTokens = this.tokens.filter(t => 
            t.type === TokenType.SALUD || 
            t.type === TokenType.ATAQUE || 
            t.type === TokenType.DEFENSA ||
            t.type === TokenType.NUMERO
        );
        console.log('🎯 Important tokens found:', importantTokens.map(t => `${t.lexeme}(${t.type})`));

        return { tokens: this.tokens, errors: this.errors };
    }

    private scanToken(): void {
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

    private scanString(startLine: number, startColumn: number): void {
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
        console.log(`📝 String token: "${value}"`);
    }

    private scanNumber(startLine: number, startColumn: number): void {
        let value = '';

        while (this.position < this.input.length && this.isDigit(this.getCurrentChar())) {
            value += this.getCurrentChar();
            this.advance();
        }

        this.addToken(TokenType.NUMERO, value, startLine, startColumn);
        console.log(`🔢 Number token: ${value}`);
    }

    private scanIdentifier(startLine: number, startColumn: number): void {
        let value = '';

        while (this.position < this.input.length && 
               (this.isAlphaNumeric(this.getCurrentChar()) || this.getCurrentChar() === '-')) {
            value += this.getCurrentChar();
            this.advance();
        }

        // Verificar si es palabra reservada
        const tokenType = RESERVED_WORDS.get(value);
        if (tokenType) {
            this.addToken(tokenType, value, startLine, startColumn);
            console.log(`🎯 Reserved word: "${value}" -> ${tokenType}`);
        } else {
            this.addToken(TokenType.CADENA_TEXTO, value, startLine, startColumn);
            console.log(`📄 Identifier: "${value}"`);
        }
    }

    private skipWhitespace(): void {
        while (this.position < this.input.length && this.isWhitespace(this.getCurrentChar())) {
            this.advance();
        }
    }

    private getCurrentChar(): string {
        if (this.position >= this.input.length) {
            return '\0';
        }
        return this.input[this.position];
    }

    private peek(): string {
        if (this.position + 1 >= this.input.length) {
            return '\0';
        }
        return this.input[this.position + 1];
    }

    private advance(): void {
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

    private isWhitespace(char: string): boolean {
        return /\s/.test(char);
    }

    private isDigit(char: string): boolean {
        return /[0-9]/.test(char);
    }

    private isLetter(char: string): boolean {
        return /[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(char);
    }

    private isAlphaNumeric(char: string): boolean {
        return this.isLetter(char) || this.isDigit(char);
    }

    private addToken(type: string, lexeme: string, line: number, column: number): void {
        this.tokens.push(new Token(type, lexeme, line, column));
    }

    private addError(character: string, line: number, column: number, description: string = 'Carácter desconocido'): void {
        this.errors.push(new LexicalError(character, line, column, description));
    }
}
