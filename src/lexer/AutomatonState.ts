export enum AutomatonState {
    S0 = 'S0',  // Estado inicial
    S1 = 'S1',  // Leyendo identificador/palabra reservada
    S2 = 'S2',  // Leyendo cadena de texto (después de ")
    S3 = 'S3',  // Leyendo número
    S4 = 'S4',  // Leyendo tipo entre corchetes (después de [)
    S5 = 'S5',  // Estado de aceptación para cadena de texto
    S6 = 'S6',  // Estado de aceptación para tipo
    S7 = 'S7',  // Leyendo := (después de :)
    ERROR = 'ERROR'  // Estado de error
}

export class AutomatonTransition {
    static getNextState(currentState: AutomatonState, character: string): AutomatonState {
        switch (currentState) {
            case AutomatonState.S0:
                if (this.isLetter(character)) return AutomatonState.S1;
                if (character === '"') return AutomatonState.S2;
                if (this.isDigit(character)) return AutomatonState.S3;
                if (character === '[') return AutomatonState.S4;
                if (character === ':') return AutomatonState.S7;
                if (this.isSymbol(character)) return AutomatonState.S0; // Retorna símbolos directamente
                if (this.isWhitespace(character)) return AutomatonState.S0;
                return AutomatonState.ERROR;

            case AutomatonState.S1:
                if (this.isAlphaNumeric(character) || character === '-') return AutomatonState.S1;
                return AutomatonState.S0; // Finaliza identificador, retrocede

            case AutomatonState.S2:
                if (character === '"') return AutomatonState.S5;
                if (character !== '\n' && character !== '\r') return AutomatonState.S2;
                return AutomatonState.ERROR;

            case AutomatonState.S3:
                if (this.isDigit(character)) return AutomatonState.S3;
                return AutomatonState.S0; // Finaliza número, retrocede

            case AutomatonState.S4:
                if (this.isLetter(character)) return AutomatonState.S4;
                if (character === ']') return AutomatonState.S6;
                return AutomatonState.ERROR;

            case AutomatonState.S5:
                return AutomatonState.S0; // Cadena completada

            case AutomatonState.S6:
                return AutomatonState.S0; // Tipo completado

            case AutomatonState.S7:
                if (character === '=') return AutomatonState.S0; // := completado
                return AutomatonState.ERROR;

            default:
                return AutomatonState.ERROR;
        }
    }

    static isAcceptingState(state: AutomatonState): boolean {
        return [
            AutomatonState.S0,
            AutomatonState.S1,
            AutomatonState.S3,
            AutomatonState.S5,
            AutomatonState.S6
        ].includes(state);
    }

    private static isLetter(char: string): boolean {
        return /[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(char);
    }

    private static isDigit(char: string): boolean {
        return /[0-9]/.test(char);
    }

    private static isAlphaNumeric(char: string): boolean {
        return this.isLetter(char) || this.isDigit(char);
    }

    private static isWhitespace(char: string): boolean {
        return /\s/.test(char);
    }

    private static isSymbol(char: string): boolean {
        return '{}[]();:='.includes(char);
    }
}
