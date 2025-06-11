export var AutomatonState;
(function (AutomatonState) {
    AutomatonState["S0"] = "S0";
    AutomatonState["S1"] = "S1";
    AutomatonState["S2"] = "S2";
    AutomatonState["S3"] = "S3";
    AutomatonState["S4"] = "S4";
    AutomatonState["S5"] = "S5";
    AutomatonState["S6"] = "S6";
    AutomatonState["S7"] = "S7";
    AutomatonState["ERROR"] = "ERROR"; // Estado de error
})(AutomatonState || (AutomatonState = {}));
export class AutomatonTransition {
    static getNextState(currentState, character) {
        switch (currentState) {
            case AutomatonState.S0:
                if (this.isLetter(character))
                    return AutomatonState.S1;
                if (character === '"')
                    return AutomatonState.S2;
                if (this.isDigit(character))
                    return AutomatonState.S3;
                if (character === '[')
                    return AutomatonState.S4;
                if (character === ':')
                    return AutomatonState.S7;
                if (this.isSymbol(character))
                    return AutomatonState.S0; // Retorna símbolos directamente
                if (this.isWhitespace(character))
                    return AutomatonState.S0;
                return AutomatonState.ERROR;
            case AutomatonState.S1:
                if (this.isAlphaNumeric(character) || character === '-')
                    return AutomatonState.S1;
                return AutomatonState.S0; // Finaliza identificador, retrocede
            case AutomatonState.S2:
                if (character === '"')
                    return AutomatonState.S5;
                if (character !== '\n' && character !== '\r')
                    return AutomatonState.S2;
                return AutomatonState.ERROR;
            case AutomatonState.S3:
                if (this.isDigit(character))
                    return AutomatonState.S3;
                return AutomatonState.S0; // Finaliza número, retrocede
            case AutomatonState.S4:
                if (this.isLetter(character))
                    return AutomatonState.S4;
                if (character === ']')
                    return AutomatonState.S6;
                return AutomatonState.ERROR;
            case AutomatonState.S5:
                return AutomatonState.S0; // Cadena completada
            case AutomatonState.S6:
                return AutomatonState.S0; // Tipo completado
            case AutomatonState.S7:
                if (character === '=')
                    return AutomatonState.S0; // := completado
                return AutomatonState.ERROR;
            default:
                return AutomatonState.ERROR;
        }
    }
    static isAcceptingState(state) {
        return [
            AutomatonState.S0,
            AutomatonState.S1,
            AutomatonState.S3,
            AutomatonState.S5,
            AutomatonState.S6
        ].includes(state);
    }
    static isLetter(char) {
        return /[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(char);
    }
    static isDigit(char) {
        return /[0-9]/.test(char);
    }
    static isAlphaNumeric(char) {
        return this.isLetter(char) || this.isDigit(char);
    }
    static isWhitespace(char) {
        return /\s/.test(char);
    }
    static isSymbol(char) {
        return '{}[]();:='.includes(char);
    }
}
//# sourceMappingURL=AutomatonState.js.map