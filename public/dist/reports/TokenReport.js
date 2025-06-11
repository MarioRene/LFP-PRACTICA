export class TokenReport {
    static generateHTML(tokens) {
        const filteredTokens = tokens.filter(token => token.type !== 'Espacio en Blanco' &&
            token.type !== 'Nueva Línea' &&
            token.type !== 'Fin de Archivo');
        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Tokens</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 20px; 
            background: linear-gradient(135deg, #f8f4ff 0%, #e8d5f2 100%);
            color: #2c3e50;
        }
        .header {
            text-align: center;
            margin-bottom: 2rem;
            background: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(155, 89, 182, 0.15);
            border: 2px solid #e8d5f2;
        }
        h1 { 
            color: #9b59b6; 
            font-size: 2.5rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        .subtitle {
            font-size: 1.2rem;
            color: #7f8c8d;
            margin-bottom: 1rem;
        }
        .stats {
            background: #e8d5f2;
            padding: 1rem 2rem;
            border-radius: 15px;
            display: inline-block;
            font-weight: 600;
            color: #9b59b6;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
            background: white; 
            border-radius: 15px; 
            overflow: hidden; 
            box-shadow: 0 8px 25px rgba(155, 89, 182, 0.15);
            border: 2px solid #e8d5f2;
        }
        th, td { 
            border: 1px solid #e8d5f2; 
            padding: 15px; 
            text-align: left; 
        }
        th { 
            background: linear-gradient(135deg, #9b59b6, #7d3c98);
            color: white; 
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        tr:nth-child(even) { 
            background: #f8f4ff; 
        }
        tr:hover {
            background: rgba(155, 89, 182, 0.1);
            transform: scale(1.01);
            transition: all 0.2s ease;
        }
        .numero { 
            text-align: center; 
            font-weight: 600;
        }
        code {
            background: #f8f4ff;
            padding: 4px 8px;
            border-radius: 6px;
            font-family: 'Consolas', 'Monaco', monospace;
            color: #9b59b6;
            border: 1px solid #e8d5f2;
        }
        .token-type {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .reservada { background: linear-gradient(135deg, #3498db, #2980b9); color: white; }
        .texto { background: linear-gradient(135deg, #e67e22, #d35400); color: white; }
        .numero-token { background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; }
        .simbolo { background: linear-gradient(135deg, #95a5a6, #7f8c8d); color: white; }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 30px;
            background: white;
            border-radius: 20px;
            border: 2px solid #e8d5f2;
            box-shadow: 0 10px 30px rgba(155, 89, 182, 0.15);
            color: #7f8c8d;
        }
        .university-info {
            color: #9b59b6;
            font-weight: 600;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Reporte de Tokens</h1>
        <p class="subtitle">Análisis léxico completo del código fuente</p>
        <div class="stats">
            Total de tokens procesados: ${filteredTokens.length}
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Fila</th>
                <th>Columna</th>
                <th>Lexema</th>
                <th>Token</th>
            </tr>
        </thead>
        <tbody>
            ${filteredTokens.map((token, i) => `
                <tr>
                    <td class="numero">${i + 1}</td>
                    <td class="numero">${token.line}</td>
                    <td class="numero">${token.column}</td>
                    <td><code>${this.escapeHtml(token.lexeme)}</code></td>
                    <td><span class="token-type ${this.getTokenClass(token.type)}">${token.type}</span></td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div class="footer">
        <div>⚡ Análisis completado exitosamente • ${new Date().toLocaleDateString('es-ES')}</div>
        <div class="university-info">
            🎓 Universidad de San Carlos de Guatemala<br>
            Facultad de Ingeniería • Lenguajes Formales y de Programación<br>
            Vacaciones de Junio 2025
        </div>
    </div>
</body>
</html>`;
    }
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    static getTokenClass(type) {
        if (type.includes('Reservada'))
            return 'reservada';
        if (type.includes('Texto'))
            return 'texto';
        if (type.includes('Número'))
            return 'numero-token';
        return 'simbolo';
    }
}
//# sourceMappingURL=TokenReport.js.map