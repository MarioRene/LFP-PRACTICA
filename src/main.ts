import { Lexer } from './lexer/Lexer.js';
import { TeamSelector } from './pokemon/TeamSelector.js';
import { TokenReport } from './reports/TokenReport.js';
import { ErrorReport } from './reports/ErrorReport.js';
import { TeamReport } from './reports/TeamReport.js';
import { FileHandler } from './ui/FileHandler.js';
import { Token, TokenType } from './lexer/Token.js';
import { LexicalError } from './lexer/LexicalError.js';
import { Player } from './pokemon/Player.js';

// Declaración global para Monaco Editor
declare global {
    interface Window {
        monaco: any;
        editor: any;
        require: any;
    }
}

class PokemonLexerApp {
    private currentTokens: Token[] = [];
    private currentErrors: LexicalError[] = [];
    private currentTeams: Player[] = [];

    constructor() {
        this.initializeApp();
    }

    private initializeApp(): void {
        this.setupMonacoEditor();
        
        setTimeout(() => {
            this.setupEventListeners();
        }, 1000);
    }

    private setupMonacoEditor(): void {
        if (!window.require) {
            console.error('Monaco Editor loader no está disponible');
            return;
        }

        window.require.config({ 
            paths: { 
                vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' 
            }
        });

        window.require(['vs/editor/editor.main'], () => {
            window.monaco.languages.register({ id: 'pokemon' });
            
            window.monaco.languages.setMonarchTokensProvider('pokemon', {
                tokenizer: {
                    root: [
                        [/Jugador|salud|ataque|defensa|agua|fuego|planta|normal|psiquico|dragon|bicho/, 'keyword'],
                        [/"[^"]*"/, 'string'],
                        [/\d+/, 'number'],
                        [/[{}[\]():;=]/, 'delimiter'],
                        [/:=/, 'operator'],
                        [/\s+/, 'white']
                    ]
                }
            });

            window.monaco.editor.defineTheme('pokemon-theme', {
                base: 'vs',
                inherit: true,
                rules: [
                    { token: 'keyword', foreground: '9b59b6', fontStyle: 'bold' },
                    { token: 'string', foreground: 'e67e22' },
                    { token: 'number', foreground: '8e44ad' },
                    { token: 'delimiter', foreground: '34495e' },
                    { token: 'operator', foreground: '2c3e50', fontStyle: 'bold' }
                ],
                colors: {
                    'editor.background': '#ffffff',
                    'editor.lineHighlightBackground': '#f8f4ff'
                }
            });

            window.editor = window.monaco.editor.create(document.getElementById('editor'), {
                value: this.getSampleCode(),
                language: 'pokemon',
                theme: 'pokemon-theme',
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                minimap: { enabled: false },
                wordWrap: 'on',
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3
            });

            window.editor.onDidChangeModelContent(() => {
                this.updateStatusBar();
            });

            this.updateStatusBar();
        });
    }

    private getSampleCode(): string {
        return `Jugador: "PokeEvee" {
    "venusaur"[planta] := (
        [salud]=12;
        [ataque]=11;
        [defensa]=15;
    )
    "charizard"[fuego] := (
        [salud]=13;
        [ataque]=15;
        [defensa]=11;
    )
    "blastoise"[agua] := (
        [salud]=15;
        [ataque]=12;
        [defensa]=14;
    )
    "pikachu"[psiquico] := (
        [salud]=10;
        [ataque]=14;
        [defensa]=8;
    )
    "dragonite"[dragon] := (
        [salud]=14;
        [ataque]=15;
        [defensa]=13;
    )
    "scyther"[bicho] := (
        [salud]=12;
        [ataque]=15;
        [defensa]=10;
    )
}`;
    }

    private setupEventListeners(): void {
        // Botones principales
        document.getElementById('analyzeBtn')?.addEventListener('click', () => this.analyzeCode());
        document.getElementById('clearEditor')?.addEventListener('click', () => this.clearEditor());
        document.getElementById('loadFile')?.addEventListener('click', () => this.loadFile());
        document.getElementById('saveFile')?.addEventListener('click', () => this.saveFile());

        // Botones de reportes
        document.getElementById('tokenReport')?.addEventListener('click', () => this.showTokenReport());
        document.getElementById('errorReport')?.addEventListener('click', () => this.showErrorReport());
        document.getElementById('teamReport')?.addEventListener('click', () => this.showTeamReport());

        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = (tab as HTMLElement).dataset.tab;
                if (tabName) this.switchTab(tabName);
            });
        });

        // File input
        document.getElementById('file-input')?.addEventListener('change', (e) => this.handleFileLoad(e));
    }

    private async analyzeCode(): Promise<void> {
        const code = this.getEditorValue();
        
        if (!code.trim()) {
            this.showStatus('Por favor, ingrese código para analizar.', 'warning');
            return;
        }

        this.showLoading(true);

        try {
            const lexer = new Lexer(code);
            const { tokens, errors } = lexer.analyze();

            this.currentTokens = tokens;
            this.currentErrors = errors;

            console.log('Tokens encontrados:', tokens.length);
            console.log('Errores encontrados:', errors.length);

            this.updateTokensTable();
            this.updateErrorsTable();
            this.updateStatusBar();

            if (errors.length > 0) {
                this.switchTab('errors');
                this.showStatus(`Análisis completado con ${errors.length} error(es) léxico(s).`, 'error');
                this.currentTeams = [];
                await this.updateTeamsDisplay();
                
                const errorReportHTML = ErrorReport.generateHTML(errors);
                this.openReportWindow(errorReportHTML, 'Reporte de Errores Léxicos');
            } else {
                const teamSelector = new TeamSelector(tokens);
                const players = teamSelector.parsePlayersAndPokemons();
                this.currentTeams = players;

                console.log('Jugadores procesados:', players.length);

                if (players.length > 0) {
                    await this.updateTeamsDisplay();
                    this.switchTab('teams');
                    this.showStatus(`Análisis completado exitosamente. ${players.length} jugador(es) procesado(s).`, 'success');
                    
                    const teamReportHTML = await TeamReport.generateHTML(players);
                    this.openReportWindow(teamReportHTML, 'Equipos Pokémon');
                } else {
                    this.switchTab('tokens');
                    this.showStatus('No se encontraron jugadores válidos en el código.', 'warning');
                }

                const tokenReportHTML = TokenReport.generateHTML(tokens);
                this.openReportWindow(tokenReportHTML, 'Reporte de Tokens');
            }

        } catch (error) {
            console.error('Error durante el análisis:', error);
            this.showStatus('Error durante el análisis del código.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    private clearEditor(): void {
        if (window.editor) {
            window.editor.setValue('');
            this.currentTokens = [];
            this.currentErrors = [];
            this.currentTeams = [];
            this.updateStatusBar();
            this.updateTokensTable();
            this.updateErrorsTable();
            this.updateTeamsDisplay();
            this.showStatus('Editor limpiado.', 'info');
        }
    }

    private async loadFile(): Promise<void> {
        try {
            const content = await FileHandler.loadFile();
            if (window.editor) {
                window.editor.setValue(content);
                this.showStatus('Archivo cargado exitosamente.', 'success');
            }
        } catch (error) {
            console.error('Error cargando archivo:', error);
            this.showStatus('Error al cargar el archivo.', 'error');
        }
    }

    private saveFile(): void {
        const content = this.getEditorValue();
        if (!content.trim()) {
            this.showStatus('No hay contenido para guardar.', 'warning');
            return;
        }

        FileHandler.saveFile(content);
        this.showStatus('Archivo guardado exitosamente.', 'success');
    }

    private showTokenReport(): void {
        if (this.currentTokens.length === 0) {
            this.showStatus('No hay tokens para mostrar. Ejecute el análisis primero.', 'warning');
            return;
        }

        const reportHTML = TokenReport.generateHTML(this.currentTokens);
        this.openReportWindow(reportHTML, 'Reporte de Tokens');
    }

    private showErrorReport(): void {
        const reportHTML = ErrorReport.generateHTML(this.currentErrors);
        this.openReportWindow(reportHTML, 'Reporte de Errores Léxicos');
    }

    private async showTeamReport(): Promise<void> {
        if (this.currentTokens.length === 0) {
            this.showStatus('No hay datos para mostrar. Ejecute el análisis primero.', 'warning');
            return;
        }

        if (this.currentErrors.length > 0) {
            this.showStatus('No se puede generar el reporte de equipos debido a errores léxicos.', 'error');
            return;
        }

        if (this.currentTeams.length === 0) {
            this.showStatus('No hay equipos válidos para mostrar.', 'warning');
            return;
        }

        try {
            this.showLoading(true);
            const reportHTML = await TeamReport.generateHTML(this.currentTeams);
            this.openReportWindow(reportHTML, 'Equipos Pokémon');
        } catch (error) {
            console.error('Error generando reporte de equipos:', error);
            this.showStatus('Error al generar el reporte de equipos.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    private openReportWindow(htmlContent: string, title: string): void {
        const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        if (newWindow) {
            newWindow.document.write(htmlContent);
            newWindow.document.title = title;
            newWindow.document.close();
        } else {
            this.downloadReport(htmlContent, title);
            this.showStatus('El navegador bloqueó la ventana emergente. Descargando archivo...', 'info');
        }
    }

    private downloadReport(htmlContent: string, title: string): void {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    private switchTab(tabName: string): void {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetTab) targetTab.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const targetContent = document.getElementById(`${tabName}-tab`);
        if (targetContent) targetContent.classList.add('active');
    }

    private updateTokensTable(): void {
        const container = document.getElementById('tokens-table');
        const empty = document.getElementById('tokens-empty');
        
        if (!container || !empty) return;

        if (this.currentTokens.length === 0) {
            container.style.display = 'none';
            empty.style.display = 'block';
            return;
        }
        
        empty.style.display = 'none';
        container.style.display = 'block';
        
        const getTokenClass = (type: string) => {
            if (type.includes('Reservada')) return 'token-reserved';
            if (type.includes('Texto')) return 'token-string';
            if (type.includes('Número')) return 'token-number';
            return 'token-symbol';
        };
        
        const filteredTokens = this.currentTokens.filter(token => 
            token.type !== 'Espacio en Blanco' && 
            token.type !== 'Nueva Línea' && 
            token.type !== 'Fin de Archivo'
        );
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Línea</th>
                        <th>Columna</th>
                        <th>Lexema</th>
                        <th>Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredTokens.map((token, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${token.line}</td>
                            <td>${token.column}</td>
                            <td><code>${this.escapeHtml(token.lexeme)}</code></td>
                            <td><span class="token-type ${getTokenClass(token.type)}">${token.type}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    private updateErrorsTable(): void {
        const container = document.getElementById('errors-table');
        const empty = document.getElementById('errors-empty');
        
        if (!container || !empty) return;

        if (this.currentErrors.length === 0) {
            container.style.display = 'none';
            empty.style.display = 'block';
            return;
        }
        
        empty.style.display = 'none';
        container.style.display = 'block';
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Línea</th>
                        <th>Columna</th>
                        <th>Carácter</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.currentErrors.map((error, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${error.line}</td>
                            <td>${error.column}</td>
                            <td><span class="error-char">${this.escapeHtml(error.character)}</span></td>
                            <td>${error.description}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    private async updateTeamsDisplay(): Promise<void> {
        const container = document.getElementById('teams-content');
        const empty = document.getElementById('teams-empty');
        
        if (!container || !empty) return;

        if (this.currentTeams.length === 0 || this.currentErrors.length > 0) {
            container.style.display = 'none';
            empty.style.display = 'block';
            return;
        }
        
        empty.style.display = 'none';
        container.style.display = 'block';
        container.innerHTML = '<p style="text-align: center; color: var(--primary);">🔄 Cargando equipos y sprites...</p>';
        
        try {
            console.log(`🎮 Updating teams display for ${this.currentTeams.length} players...`);
            let html = '';
            
            for (const player of this.currentTeams) {
                const team = player.getBestTeam();
                
                html += `
                    <div style="margin-bottom: 2rem; padding: 1.5rem; border: 2px solid var(--accent); border-radius: 15px; background: linear-gradient(135deg, #fff 0%, var(--secondary) 100%);">
                        <h3 style="color: var(--primary); margin-bottom: 1rem; text-align: center; font-size: 1.3rem;">
                            <i class="fas fa-user"></i> ${player.name}
                        </h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
                `;

                // Import PokeAPIService dynamically
                const { PokeAPIService } = await import('./api/PokeAPI.js');
                
                console.log(`🔄 Fetching sprites for ${player.name}: ${team.map(p => p.name).join(', ')}`);
                const pokemonNames = team.map(p => p.name);
                const sprites = await PokeAPIService.getPokemonSprites(pokemonNames);
                console.log(`📦 Received sprites for ${player.name}:`, sprites.map(s => s.name));

                team.forEach((pokemon, index) => {
                    const iv = pokemon.calculateIV();
                    const sprite = sprites[index]?.sprite || PokeAPIService.getDefaultSprite();
                    
                    html += `
                        <div style="text-align: center; padding: 1rem; background: white; border-radius: 10px; border: 1px solid var(--border); box-shadow: 0 2px 8px var(--shadow);">
                            <img src="${sprite}" 
                                 alt="${pokemon.name}" 
                                 style="width: 80px; height: 80px; margin: 0 auto; border-radius: 50%; border: 2px solid var(--accent); background: white; object-fit: contain; margin-bottom: 0.5rem;"
                                 onerror="this.src='${PokeAPIService.getDefaultSprite()}';">
                            <h4 style="margin: 0.5rem 0; color: var(--text-dark); font-size: 1rem;">${pokemon.name}</h4>
                            <div style="background: var(--primary); color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; margin: 0.5rem 0; display: inline-block;">
                                ${pokemon.type}
                            </div>
                            <div style="color: var(--primary); font-weight: bold; font-size: 0.9rem;">
                                IV: ${iv.toFixed(1)}%
                            </div>
                            <div style="font-size: 0.8rem; color: var(--text-light); margin-top: 0.3rem;">
                                S:${pokemon.health} A:${pokemon.attack} D:${pokemon.defense}
                            </div>
                        </div>
                    `;
                });

                html += `</div></div>`;
            }
            
            container.innerHTML = html;
            console.log(`✅ Teams display updated successfully!`);
            
        } catch (error) {
            console.error('💥 Error generando vista previa de equipos:', error);
            container.innerHTML = '<p style="text-align: center; color: var(--error);">Error al generar vista previa de equipos</p>';
        }
    }

    private updateStatusBar(): void {
        const lineCountEl = document.getElementById('line-count');
        const tokenCountEl = document.getElementById('token-count');
        const errorCountEl = document.getElementById('error-count');
        
        if (lineCountEl && window.editor) {
            const model = window.editor.getModel();
            const lineCount = model ? model.getLineCount() : 0;
            lineCountEl.textContent = `Líneas: ${lineCount}`;
        }
        
        if (tokenCountEl) {
            tokenCountEl.textContent = `Tokens: ${this.currentTokens.length}`;
        }
        
        if (errorCountEl) {
            errorCountEl.textContent = `Errores: ${this.currentErrors.length}`;
        }
    }

    private showLoading(show: boolean): void {
        const loadingEl = document.getElementById('loading');
        const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
        
        if (loadingEl) {
            loadingEl.style.display = show ? 'flex' : 'none';
        }
        
        if (analyzeBtn) {
            analyzeBtn.disabled = show;
            analyzeBtn.innerHTML = show 
                ? '<i class="fas fa-spinner fa-spin"></i> Analizando...' 
                : '<i class="fas fa-play"></i> Analizar';
        }
    }

    private showStatus(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
        const statusEl = document.getElementById('status-message');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `status-message ${type}`;
            statusEl.style.display = 'block';

            setTimeout(() => {
                statusEl.style.display = 'none';
            }, 5000);
        }
    }

    private getEditorValue(): string {
        return window.editor ? window.editor.getValue() : '';
    }

    private handleFileLoad(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            if (window.editor) {
                window.editor.setValue(content);
                this.showStatus('Archivo cargado exitosamente.', 'success');
            }
        };
        reader.onerror = () => {
            this.showStatus('Error al leer el archivo.', 'error');
        };
        reader.readAsText(file);
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new PokemonLexerApp();
});
