export declare class FileHandler {
    static loadFile(): Promise<string>;
    static saveFile(content: string, filename?: string): void;
}
