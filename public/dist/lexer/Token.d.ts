export declare enum TokenType {
    JUGADOR = "Palabra Reservada",
    SALUD = "Palabra Reservada",
    ATAQUE = "Palabra Reservada",
    DEFENSA = "Palabra Reservada",
    AGUA = "Palabra Reservada",
    FUEGO = "Palabra Reservada",
    PLANTA = "Palabra Reservada",
    NORMAL = "Palabra Reservada",
    PSIQUICO = "Palabra Reservada",
    DRAGON = "Palabra Reservada",
    BICHO = "Palabra Reservada",
    CADENA_TEXTO = "Cadena de Texto",
    NUMERO = "N\u00FAmero Entero",
    DOS_PUNTOS = "Dos Puntos",
    PUNTO_COMA = "Punto y Coma",
    LLAVE_ABRE = "Llave Abre",
    LLAVE_CIERRA = "Llave Cierra",
    CORCHETE_ABRE = "Corchete Abre",
    CORCHETE_CIERRA = "Corchete Cierra",
    PARENTESIS_ABRE = "Par\u00E9ntesis Abre",
    PARENTESIS_CIERRA = "Par\u00E9ntesis Cierra",
    ASIGNACION = "Asignaci\u00F3n",
    IGUAL = "Igual",
    EOF = "Fin de Archivo",
    WHITESPACE = "Espacio en Blanco",
    NEWLINE = "Nueva L\u00EDnea"
}
export declare const RESERVED_WORDS: Map<string, TokenType>;
export declare class Token {
    type: string;
    lexeme: string;
    line: number;
    column: number;
    constructor(type: string, lexeme: string, line: number, column: number);
    toString(): string;
}
