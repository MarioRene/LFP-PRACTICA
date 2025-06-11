export class Pokemon {
    public name: string;
    public type: string;
    public health: number;
    public attack: number;
    public defense: number;

    constructor(name: string, type: string, health: number, attack: number, defense: number) {
        this.name = name;
        this.type = type;
        this.health = health;
        this.attack = attack;
        this.defense = defense;
    }

    public calculateIV(): number {
        return ((this.health + this.attack + this.defense) / 45) * 100;
    }

    public toString(): string {
        return `${this.name} [${this.type}] - IV: ${this.calculateIV().toFixed(2)}%`;
    }
}
