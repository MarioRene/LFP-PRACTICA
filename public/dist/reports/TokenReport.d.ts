import { Token } from '../lexer/Token.js';
export declare class TokenReport {
    static generateHTML(tokens: Token[]): string;
    private static escapeHtml;
    private static getTokenClass;
}
