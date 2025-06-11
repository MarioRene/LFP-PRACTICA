import { LexicalError } from '../lexer/LexicalError.js';
export declare class ErrorReport {
    static generateHTML(errors: LexicalError[]): string;
    private static escapeHtml;
}
