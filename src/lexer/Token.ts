export enum TokenType {
    // Palabras reservadas
    JUGADOR = 'Palabra Reservada',
    SALUD = 'Palabra Reservada',
    ATAQUE = 'Palabra Reservada',
    DEFENSA = 'Palabra Reservada',
    
    // Tipos de Pokémon
    AGUA = 'Palabra Reservada',
    FUEGO = 'Palabra Reservada',
    PLANTA = 'Palabra Reservada',
    NORMAL = 'Palabra Reservada',
    PSIQUICO = 'Palabra Reservada',
    DRAGON = 'Palabra Reservada',
    BICHO = 'Palabra Reservada',
    
    // Literales
    CADENA_TEXTO = 'Cadena de Texto',
    NUMERO = 'Número Entero',
    
    // Símbolos
    DOS_PUNTOS = 'Dos Puntos',
    PUNTO_COMA = 'Punto y Coma',
    LLAVE_ABRE = 'Llave Abre',
    LLAVE_CIERRA = 'Llave Cierra',
    CORCHETE_ABRE = 'Corchete Abre',
    CORCHETE_CIERRA = 'Corchete Cierra',
    PARENTESIS_ABRE = 'Paréntesis Abre',
    PARENTESIS_CIERRA = 'Paréntesis Cierra',
    ASIGNACION = 'Asignación',
    IGUAL = 'Igual',
    
    // Especiales
    EOF = 'Fin de Archivo',
    WHITESPACE = 'Espacio en Blanco',
    NEWLINE = 'Nueva Línea'
}

export const RESERVED_WORDS = new Map<string, TokenType>([
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

export class Token {
    public type: string;
    public lexeme: string;
    public line: number;
    public column: number;

    constructor(type: string, lexeme: string, line: number, column: number) {
        this.type = type;
        this.lexeme = lexeme;
        this.line = line;
        this.column = column;
    }

    public toString(): string {
        return `Token(${this.type}, "${this.lexeme}", ${this.line}:${this.column})`;
    }
}
