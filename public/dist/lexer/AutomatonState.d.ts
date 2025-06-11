export declare enum AutomatonState {
    S0 = "S0",// Estado inicial
    S1 = "S1",// Leyendo identificador/palabra reservada
    S2 = "S2",// Leyendo cadena de texto (después de ")
    S3 = "S3",// Leyendo número
    S4 = "S4",// Leyendo tipo entre corchetes (después de [)
    S5 = "S5",// Estado de aceptación para cadena de texto
    S6 = "S6",// Estado de aceptación para tipo
    S7 = "S7",// Leyendo := (después de :)
    ERROR = "ERROR"
}
export declare class AutomatonTransition {
    static getNextState(currentState: AutomatonState, character: string): AutomatonState;
    static isAcceptingState(state: AutomatonState): boolean;
    private static isLetter;
    private static isDigit;
    private static isAlphaNumeric;
    private static isWhitespace;
    private static isSymbol;
}
