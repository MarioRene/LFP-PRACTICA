export class PokeAPIService {
    static async getPokemonSprite(pokemonName) {
        try {
            let normalizedName = pokemonName.toLowerCase().trim();
            const nameMapping = {
                'nidoran♀': 'nidoran-f',
                'nidoran♂': 'nidoran-m',
                'mr.mime': 'mr-mime',
                'farfetch\'d': 'farfetchd',
                'ho-oh': 'ho-oh',
                'mime jr.': 'mime-jr',
                'porygon-z': 'porygon-z',
                'jangmo-o': 'jangmo-o',
                'hakamo-o': 'hakamo-o',
                'kommo-o': 'kommo-o',
                'tapu koko': 'tapu-koko',
                'tapu lele': 'tapu-lele',
                'tapu bulu': 'tapu-bulu',
                'tapu fini': 'tapu-fini',
                'type: null': 'type-null',
                'flabébé': 'flabebe',
                'greninja': 'greninja',
                'salamence': 'salamence',
                'torterra': 'torterra',
                'charizard': 'charizard',
                'persian': 'persian',
                'mew': 'mew',
                'venusaur': 'venusaur',
                'blastoise': 'blastoise',
                'pikachu': 'pikachu',
                'dragonite': 'dragonite',
                'scyther': 'scyther',
                'butterfree': 'butterfree',
                'snorlax': 'snorlax',
                'victreebel': 'victreebel',
                'flareon': 'flareon'
            };
            if (nameMapping[normalizedName]) {
                normalizedName = nameMapping[normalizedName];
            }
            else {
                normalizedName = normalizedName
                    .replace(/[^a-z0-9\-]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
            }
            console.log(`🔍 Fetching sprite for: "${pokemonName}" -> "${normalizedName}"`);
            const url = `https://pokeapi.co/api/v2/pokemon/${normalizedName}`;
            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`❌ Pokemon ${pokemonName} not found in PokeAPI (${response.status})`);
                return this.getDefaultSprite();
            }
            const data = await response.json();
            let sprite = null;
            if (data.sprites) {
                if (data.sprites.other && data.sprites.other['official-artwork'] && data.sprites.other['official-artwork'].front_default) {
                    sprite = data.sprites.other['official-artwork'].front_default;
                }
                else if (data.sprites.front_default) {
                    sprite = data.sprites.front_default;
                }
                else if (data.sprites.other && data.sprites.other['home'] && data.sprites.other['home'].front_default) {
                    sprite = data.sprites.other['home'].front_default;
                }
            }
            if (sprite) {
                console.log(`✅ Sprite found for ${pokemonName}:`, sprite);
                return sprite;
            }
            else {
                console.warn(`⚠️ No sprite available for ${pokemonName}`);
                return this.getDefaultSprite();
            }
        }
        catch (error) {
            console.error(`💥 Error fetching sprite for ${pokemonName}:`, error);
            return this.getDefaultSprite();
        }
    }
    static async getPokemonSprites(pokemonNames) {
        console.log(`🎯 Fetching sprites for ${pokemonNames.length} Pokemon:`, pokemonNames);
        const results = [];
        for (const name of pokemonNames) {
            try {
                const sprite = await this.getPokemonSprite(name);
                results.push({ name, sprite });
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            catch (error) {
                console.error(`Error processing ${name}:`, error);
                results.push({ name, sprite: this.getDefaultSprite() });
            }
        }
        console.log(`📊 Sprites fetch completed. ${results.length} results.`);
        return results;
    }
    static getDefaultSprite() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI2Y4ZjRmZiIgc3Ryb2tlPSIjOWI1OWI2IiBzdHJva2Utd2lkdGg9IjMiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZThkNWYyIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSI1MCIgeT0iNTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMCIgZmlsbD0iIzliNTliNiI+8J+StzwvdGV4dD4KPC9zdmc+';
    }
    static async preloadSprite(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
            img.src = url;
        });
    }
}
