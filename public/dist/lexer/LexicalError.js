export class LexicalError {
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
