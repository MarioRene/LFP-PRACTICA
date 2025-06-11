import { Token } from './Token.js';
import { LexicalError } from './LexicalError.js';
export interface AnalysisResult {
    tokens: Token[];
    errors: LexicalError[];
}
export declare class Lexer {
    private input;
    private position;
    private line;
    private column;
    private tokens;
    private errors;
    constructor(input: string);
    analyze(): AnalysisResult;
    private scanToken;
    private scanString;
    private scanNumber;
    private scanIdentifier;
    private skipWhitespace;
    private getCurrentChar;
    private peek;
    private advance;
    private isWhitespace;
    private isDigit;
    private isLetter;
    private isAlphaNumeric;
    private addToken;
    private addError;
}
