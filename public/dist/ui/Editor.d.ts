export declare class SyntaxHighlighter {
    private static readonly TOKEN_COLORS;
    static highlightSyntax(code: string): string;
}
export declare class Editor {
    private textArea;
    private highlightDiv;
    constructor(textAreaId: string, highlightDivId: string);
    private setupSyntaxHighlighting;
    private synchronizeScroll;
    private insertTab;
    getValue(): string;
    setValue(value: string): void;
    clear(): void;
}
