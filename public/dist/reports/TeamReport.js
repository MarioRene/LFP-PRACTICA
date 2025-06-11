import { PokeAPIService } from '../api/PokeAPI.js';
export class TeamReport {
    static async generateHTML(players) {
        let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Equipos Pokémon</title>
    <style>
        :root {
            --primary: #9b59b6;
            --primary-light: #bb8fce;
            --primary-dark: #7d3c98;
            --secondary: #f8f4ff;
            --accent: #e8d5f2;
            --text-dark: #2c3e50;
            --text-light: #34495e;
            --success: #27ae60;
            --error: #e74c3c;
            --warning: #f39c12;
            --border: #d5c3e0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%);
            color: var(--text-dark);
            min-height: 100vh;
        }

        .header {
            text-align: center;
            margin-bottom: 3rem;
            background: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(155, 89, 182, 0.15);
            border: 2px solid var(--accent);
        }

        h1 { 
            color: var(--primary); 
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .subtitle {
            font-size: 1.2rem;
            color: var(--text-light);
            margin-bottom: 1rem;
        }

        .stats-summary {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 1.5rem;
        }

        .stat-item {
            text-align: center;
            padding: 1rem;
            background: var(--accent);
            border-radius: 15px;
            min-width: 120px;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary);
        }

        .stat-label {
            font-size: 0.9rem;
            color: var(--text-light);
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .player-section { 
            background: white; 
            margin: 40px 0; 
            padding: 30px; 
            border-radius: 20px; 
            box-shadow: 0 15px 35px rgba(155, 89, 182, 0.15);
            border: 3px solid var(--accent);
            position: relative;
            overflow: hidden;
        }

        .player-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, var(--primary), var(--primary-dark), var(--primary));
        }

        .player-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--accent);
        }

        .player-name { 
            color: var(--primary); 
            font-size: 2.5rem; 
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .player-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
        }

        .team-stats {
            text-align: right;
            color: var(--text-light);
        }

        .team-count {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }

        .avg-iv {
            font-size: 1.3rem;
            font-weight: bold;
            color: var(--primary);
        }

        .pokemon-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
            gap: 25px; 
        }

        .pokemon-card { 
            background: linear-gradient(135deg, #fff 0%, var(--secondary) 100%);
            border: 3px solid var(--accent); 
            border-radius: 20px; 
            padding: 25px; 
            text-align: center; 
            transition: all 0.4s ease;
            box-shadow: 0 8px 25px rgba(155, 89, 182, 0.1);
            position: relative;
            overflow: hidden;
        }

        .pokemon-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(155, 89, 182, 0.1), transparent);
            transform: rotate(45deg);
            transition: all 0.6s ease;
            opacity: 0;
        }

        .pokemon-card:hover { 
            transform: translateY(-10px) scale(1.02); 
            border-color: var(--primary);
            box-shadow: 0 20px 40px rgba(155, 89, 182, 0.25);
        }

        .pokemon-card:hover::before {
            opacity: 1;
            animation: shimmer 1.5s ease-in-out;
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        .pokemon-image { 
            width: 120px; 
            height: 120px; 
            margin: 0 auto 20px; 
            display: block; 
            border-radius: 50%;
            border: 4px solid var(--accent);
            background: white;
            object-fit: cover;
            transition: all 0.3s ease;
            position: relative;
            z-index: 1;
        }

        .pokemon-card:hover .pokemon-image {
            border-color: var(--primary);
            transform: scale(1.1);
        }

        .pokemon-name { 
            font-weight: 700; 
            color: var(--text-dark); 
            margin: 15px 0; 
            font-size: 1.4rem;
            text-transform: capitalize;
            position: relative;
            z-index: 1;
        }

        .pokemon-type { 
            color: white; 
            padding: 10px 20px; 
            border-radius: 25px; 
            font-size: 0.9rem; 
            margin: 15px auto;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            display: inline-block;
            min-width: 100px;
            position: relative;
            z-index: 1;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .pokemon-stats-container {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            background: var(--secondary);
            padding: 15px;
            border-radius: 15px;
            position: relative;
            z-index: 1;
        }

        .stat {
            text-align: center;
            flex: 1;
        }

        .stat-label {
            color: var(--text-light);
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }

        .stat-value {
            font-weight: bold;
            color: var(--text-dark);
            font-size: 1.3rem;
        }

        .pokemon-iv { 
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            font-weight: bold; 
            font-size: 1.3rem;
            margin-top: 15px;
            padding: 12px 20px;
            border-radius: 25px;
            display: inline-block;
            min-width: 120px;
            position: relative;
            z-index: 1;
            box-shadow: 0 6px 20px rgba(155, 89, 182, 0.3);
        }

        .iv-excellent { background: linear-gradient(135deg, #27ae60, #229954); }
        .iv-good { background: linear-gradient(135deg, #f39c12, #e67e22); }
        .iv-average { background: linear-gradient(135deg, #95a5a6, #7f8c8d); }

        .rank-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background: var(--primary);
            color: white;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.1rem;
            z-index: 2;
        }

        /* Tipos de Pokémon */
        .type-agua { background: linear-gradient(135deg, #3498db, #2980b9); }
        .type-fuego { background: linear-gradient(135deg, #e74c3c, #c0392b); }
        .type-planta { background: linear-gradient(135deg, #27ae60, #229954); }
        .type-normal { background: linear-gradient(135deg, #95a5a6, #7f8c8d); }
        .type-psiquico { background: linear-gradient(135deg, #e91e63, #ad1457); }
        .type-dragon { background: linear-gradient(135deg, #9b59b6, #8e44ad); }
        .type-bicho { background: linear-gradient(135deg, #8bc34a, #689f38); }

        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 30px;
            background: white;
            border-radius: 20px;
            border: 2px solid var(--accent);
            box-shadow: 0 10px 30px rgba(155, 89, 182, 0.15);
        }

        .footer-text {
            color: var(--text-light);
            font-size: 1.1rem;
            margin-bottom: 10px;
        }

        .university-info {
            color: var(--primary);
            font-weight: 600;
            font-size: 1rem;
        }

        @media (max-width: 768px) {
            .pokemon-grid { 
                grid-template-columns: 1fr; 
            }
            
            .player-header {
                flex-direction: column;
                gap: 1rem;
                text-align: center;
            }
            
            .stats-summary {
                flex-direction: column;
                gap: 1rem;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            .player-name {
                font-size: 2rem;
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .pokemon-card {
            animation: fadeInUp 0.6s ease forwards;
        }

        .pokemon-card:nth-child(1) { animation-delay: 0.1s; }
        .pokemon-card:nth-child(2) { animation-delay: 0.2s; }
        .pokemon-card:nth-child(3) { animation-delay: 0.3s; }
        .pokemon-card:nth-child(4) { animation-delay: 0.4s; }
        .pokemon-card:nth-child(5) { animation-delay: 0.5s; }
        .pokemon-card:nth-child(6) { animation-delay: 0.6s; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏆 Equipos Pokémon Seleccionados</h1>
        <p class="subtitle">
            Los mejores equipos han sido seleccionados basándose en los IV's más altos,<br>
            priorizando la diversidad de tipos para una estrategia balanceada.
        </p>
        <div class="stats-summary">
            <div class="stat-item">
                <div class="stat-number">${players.length}</div>
                <div class="stat-label">Jugadores</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${players.reduce((total, player) => total + player.getBestTeam().length, 0)}</div>
                <div class="stat-label">Pokémon Total</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${this.calculateOverallAverageIV(players).toFixed(1)}%</div>
                <div class="stat-label">IV Promedio</div>
            </div>
        </div>
    </div>`;
        for (const player of players) {
            const team = player.getBestTeam();
            const averageIV = team.reduce((sum, pokemon) => sum + pokemon.calculateIV(), 0) / team.length;
            html += `
    <div class="player-section">
        <div class="player-header">
            <div class="player-name">
                <div class="player-icon">👤</div>
                ${player.name}
            </div>
            <div class="team-stats">
                <div class="team-count">Equipo de ${team.length} Pokémon</div>
                <div class="avg-iv">IV Promedio: ${averageIV.toFixed(1)}%</div>
            </div>
        </div>
        <div class="pokemon-grid">`;
            const pokemonNames = team.map(p => p.name);
            const sprites = await PokeAPIService.getPokemonSprites(pokemonNames);
            team.forEach((pokemon, index) => {
                const sprite = sprites[index]?.sprite || this.getDefaultSprite();
                const iv = pokemon.calculateIV();
                const ivClass = iv >= 80 ? 'iv-excellent' : iv >= 60 ? 'iv-good' : 'iv-average';
                html += `
            <div class="pokemon-card">
                <div class="rank-badge">${index + 1}</div>
                <img src="${sprite}" alt="${pokemon.name}" class="pokemon-image" 
                     onerror="this.src='${this.getDefaultSprite()}'">
                <div class="pokemon-name">${pokemon.name}</div>
                <div class="pokemon-type type-${pokemon.type}">${pokemon.type}</div>
                <div class="pokemon-stats-container">
                    <div class="stat">
                        <div class="stat-label">💚 Salud</div>
                        <div class="stat-value">${pokemon.health}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">⚔️ Ataque</div>
                        <div class="stat-value">${pokemon.attack}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">🛡️ Defensa</div>
                        <div class="stat-value">${pokemon.defense}</div>
                    </div>
                </div>
                <div class="pokemon-iv ${ivClass}">
                    📈 IV: ${iv.toFixed(1)}%
                </div>
            </div>`;
            });
            html += `
        </div>
    </div>`;
        }
        html += `
    <div class="footer">
        <div class="footer-text">
            ⚡ Análisis completado exitosamente • ${new Date().toLocaleDateString('es-ES')}
        </div>
        <div class="university-info">
            🎓 Universidad de San Carlos de Guatemala<br>
            Facultad de Ingeniería • Lenguajes Formales y de Programación<br>
            Vacaciones de Junio 2025
        </div>
    </div>
</body>
</html>`;
        return html;
    }
    static calculateOverallAverageIV(players) {
        let totalIV = 0;
        let totalPokemon = 0;
        for (const player of players) {
            const team = player.getBestTeam();
            for (const pokemon of team) {
                totalIV += pokemon.calculateIV();
                totalPokemon++;
            }
        }
        return totalPokemon > 0 ? totalIV / totalPokemon : 0;
    }
    static getDefaultSprite() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIGZpbGw9IiNmOGY0ZmYiIHN0cm9rZT0iIzliNTliNiIgc3Ryb2tlLXdpZHRoPSIzIi8+IDx0ZXh0IHg9IjUwIiB5PSI1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWI1OWI2Ij7wn5KXPC90ZXh0Pjwvc3ZnPg==';
    }
}
