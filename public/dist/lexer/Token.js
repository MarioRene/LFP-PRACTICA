export var TokenType;
(function (TokenType) {
    TokenType["JUGADOR"] = "Palabra Reservada";
    TokenType["SALUD"] = "Palabra Reservada";
    TokenType["ATAQUE"] = "Palabra Reservada";
    TokenType["DEFENSA"] = "Palabra Reservada";
    TokenType["AGUA"] = "Palabra Reservada";
    TokenType["FUEGO"] = "Palabra Reservada";
    TokenType["PLANTA"] = "Palabra Reservada";
    TokenType["NORMAL"] = "Palabra Reservada";
    TokenType["PSIQUICO"] = "Palabra Reservada";
    TokenType["DRAGON"] = "Palabra Reservada";
    TokenType["BICHO"] = "Palabra Reservada";
    TokenType["CADENA_TEXTO"] = "Cadena de Texto";
    TokenType["NUMERO"] = "N\u00FAmero Entero";
    TokenType["DOS_PUNTOS"] = "Dos Puntos";
    TokenType["PUNTO_COMA"] = "Punto y Coma";
    TokenType["LLAVE_ABRE"] = "Llave Abre";
    TokenType["LLAVE_CIERRA"] = "Llave Cierra";
    TokenType["CORCHETE_ABRE"] = "Corchete Abre";
    TokenType["CORCHETE_CIERRA"] = "Corchete Cierra";
    TokenType["PARENTESIS_ABRE"] = "Par\u00E9ntesis Abre";
    TokenType["PARENTESIS_CIERRA"] = "Par\u00E9ntesis Cierra";
    TokenType["ASIGNACION"] = "Asignaci\u00F3n";
    TokenType["IGUAL"] = "Igual";
    TokenType["EOF"] = "Fin de Archivo";
    TokenType["WHITESPACE"] = "Espacio en Blanco";
    TokenType["NEWLINE"] = "Nueva L\u00EDnea";
})(TokenType || (TokenType = {}));
export const RESERVED_WORDS = new Map([
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
    ['bicho', TokenType.BICHO],
    ['Agua', TokenType.AGUA],
    ['Fuego', TokenType.FUEGO],
    ['Planta', TokenType.PLANTA],
    ['Normal', TokenType.NORMAL],
    ['Psiquico', TokenType.PSIQUICO],
    ['Dragon', TokenType.DRAGON],
    ['Bicho', TokenType.BICHO]
]);
export class Token {
    constructor(type, lexeme, line, column) {
        this.type = type;
        this.lexeme = lexeme;
        this.line = line;
        this.column = column;
    }
    toString() {
        return `Token(${this.type}, "${this.lexeme}", ${this.line}:${this.column})`;
    }
    isReservedWord() {
        return this.type === TokenType.JUGADOR ||
            this.type === TokenType.SALUD ||
            this.type === TokenType.ATAQUE ||
            this.type === TokenType.DEFENSA ||
            this.type === TokenType.AGUA ||
            this.type === TokenType.FUEGO ||
            this.type === TokenType.PLANTA ||
            this.type === TokenType.NORMAL ||
            this.type === TokenType.PSIQUICO ||
            this.type === TokenType.DRAGON ||
            this.type === TokenType.BICHO;
    }
    isStatToken() {
        return this.type === TokenType.SALUD ||
            this.type === TokenType.ATAQUE ||
            this.type === TokenType.DEFENSA;
    }
    isTypeToken() {
        return this.type === TokenType.AGUA ||
            this.type === TokenType.FUEGO ||
            this.type === TokenType.PLANTA ||
            this.type === TokenType.NORMAL ||
            this.type === TokenType.PSIQUICO ||
            this.type === TokenType.DRAGON ||
            this.type === TokenType.BICHO;
    }
}
