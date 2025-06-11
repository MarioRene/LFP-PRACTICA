export class LexicalError {
    public character: string;
    public line: number;
    public column: number;
    public description: string;

    constructor(character: string, line: number, column: number, description: string = 'Carácter desconocido') {
        this.character = character;
        this.line = line;
        this.column = column;
        this.description = description;
    }

    public toString(): string {
        return `Error léxico en línea ${this.line}, columna ${this.column}: '${this.character}' - ${this.description}`;
    }
}
