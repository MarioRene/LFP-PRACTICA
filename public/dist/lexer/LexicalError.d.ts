export declare class LexicalError {
    character: string;
    line: number;
    column: number;
    description: string;
    constructor(character: string, line: number, column: number, description?: string);
    toString(): string;
}
