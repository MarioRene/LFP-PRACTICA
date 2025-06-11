import { Player } from '../pokemon/Player.js';
export declare class TeamReport {
    static generateHTML(players: Player[]): Promise<string>;
    private static calculateOverallAverageIV;
    private static getDefaultSprite;
}
