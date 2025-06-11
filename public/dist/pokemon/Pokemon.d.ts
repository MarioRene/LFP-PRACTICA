export declare class Pokemon {
    name: string;
    type: string;
    health: number;
    attack: number;
    defense: number;
    constructor(name: string, type: string, health: number, attack: number, defense: number);
    calculateIV(): number;
    toString(): string;
}
