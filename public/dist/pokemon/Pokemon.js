export class Pokemon {
    constructor(name, type, health, attack, defense) {
        this.name = name;
        this.type = type;
        this.health = health;
        this.attack = attack;
        this.defense = defense;
    }
    calculateIV() {
        return ((this.health + this.attack + this.defense) / 45) * 100;
    }
    toString() {
        return `${this.name} [${this.type}] - IV: ${this.calculateIV().toFixed(2)}%`;
    }
}
//# sourceMappingURL=Pokemon.js.map