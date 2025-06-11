export class ErrorReport {
    static generateHTML(errors) {
        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Errores Léxicos</title>
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
            box-shadow: 0 10px 30px rgba(231, 76, 60, 0.15);
            border: 2px solid #ffebee;
        }
        h1 { 
            color: #e74c3c; 
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
            background: ${errors.length === 0 ? '#d5f4e6' : '#ffebee'};
            padding: 1rem 2rem;
            border-radius: 15px;
            display: inline-block;
            font-weight: 600;
            color: ${errors.length === 0 ? '#27ae60' : '#e74c3c'};
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
            background: white; 
            border-radius: 15px; 
            overflow: hidden; 
            box-shadow: 0 8px 25px rgba(231, 76, 60, 0.15);
            border: 2px solid #ffebee;
        }
        th, td { 
            border: 1px solid #ffebee; 
            padding: 15px; 
            text-align: left; 
        }
        th { 
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white; 
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        tr:nth-child(even) { 
            background: #ffebee; 
        }
        tr:hover {
            background: rgba(231, 76, 60, 0.1);
            transform: scale(1.01);
            transition: all 0.2s ease;
        }
        .numero { 
            text-align: center; 
            font-weight: 600;
        }
        .character { 
            font-family: 'Consolas', 'Monaco', monospace; 
            font-weight: bold; 
            color: #e74c3c;
            background: #ffebee;
            padding: 4px 8px;
            border-radius: 6px;
            border: 1px solid #e74c3c;
        }
        .no-errors { 
            text-align: center; 
            color: #27ae60; 
            font-size: 1.5rem;
            background: white;
            padding: 3rem;
            border-radius: 20px;
            border: 2px solid #d5f4e6;
            box-shadow: 0 10px 30px rgba(39, 174, 96, 0.15);
        }
        .success-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 30px;
            background: white;
            border-radius: 20px;
            border: 2px solid ${errors.length === 0 ? '#d5f4e6' : '#ffebee'};
            box-shadow: 0 10px 30px ${errors.length === 0 ? 'rgba(39, 174, 96, 0.15)' : 'rgba(231, 76, 60, 0.15)'};
            color: #7f8c8d;
        }
        .university-info {
            color: ${errors.length === 0 ? '#27ae60' : '#e74c3c'};
            font-weight: 600;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${errors.length === 0 ? '✅' : '❌'} Reporte de Errores Léxicos</h1>
        <p class="subtitle">
            ${errors.length === 0 ? 'Análisis completado sin errores' : 'Errores encontrados durante el análisis léxico'}
        </p>
        <div class="stats">
            ${errors.length === 0 ? '¡Sin errores encontrados!' : `${errors.length} error(es) léxico(s) encontrado(s)`}
        </div>
    </div>
    
    ${errors.length === 0 ?
            `<div class="no-errors">
            <div class="success-icon">🎉</div>
            <h2>¡Excelente!</h2>
            <p>El código fuente no contiene errores léxicos.<br>Puede proceder con el análisis sintáctico.</p>
        </div>` :
            `<table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Fila</th>
                    <th>Columna</th>
                    <th>Carácter</th>
                    <th>Descripción</th>
                </tr>
            </thead>
            <tbody>
                ${errors.map((error, i) => `
                    <tr>
                        <td class="numero">${i + 1}</td>
                        <td class="numero">${error.line}</td>
                        <td class="numero">${error.column}</td>
                        <td><span class="character">${this.escapeHtml(error.character)}</span></td>
                        <td>${error.description}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`}
    
    <div class="footer">
        <div>⚡ Análisis completado • ${new Date().toLocaleDateString('es-ES')}</div>
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
}
//# sourceMappingURL=ErrorReport.js.map