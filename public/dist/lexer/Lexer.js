import { Token, TokenType, RESERVED_WORDS } from './Token.js';
import { LexicalError } from './LexicalError.js';
export class Lexer {
    constructor(input) {
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
        this.errors = [];
        this.input = input;
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
                }
                else {
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
        }
        else {
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
            }
            else {
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
//# sourceMappingURL=Lexer.js.map