import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
// Para ES modules en TypeScript - Obtener directorio del proyecto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// IMPORTANTE: Ajustar ruta base según estructura de proyecto
const PROJECT_ROOT = process.cwd(); // Usar directorio de trabajo actual como raíz
const app = express();
const PORT = parseInt(process.env.PORT || '8080');
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${timestamp} - ${req.method} ${req.url}`);
    next();
});
// Middleware especial para manejar importaciones de módulos ES6
app.use('/dist', (req, res, next) => {
    const originalUrl = req.url;
    // Si la URL no tiene extensión, agregar .js
    if (!path.extname(originalUrl) && !originalUrl.endsWith('/')) {
        const jsPath = originalUrl + '.js';
        const fullPath = path.join(PROJECT_ROOT, 'public/dist', jsPath);
        if (fs.existsSync(fullPath)) {
            req.url = jsPath;
        }
    }
    next();
});
// Servir archivos estáticos desde public (usando PROJECT_ROOT)
app.use(express.static(path.join(PROJECT_ROOT, 'public'), {
    setHeaders: (res, filePath) => {
        // Configurar MIME types para módulos ES6
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        else if (filePath.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));
// Ruta principal
app.get('/', (req, res) => {
    const indexPath = path.join(PROJECT_ROOT, 'public', 'index.html');
    console.log(`🔍 Serving index.html from: ${indexPath}`);
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    }
    else {
        console.error(`❌ index.html not found at: ${indexPath}`);
        res.status(404).send(`
            <h1>Error 404</h1>
            <p>index.html not found at: ${indexPath}</p>
            <p>Working directory: ${process.cwd()}</p>
            <p>__dirname: ${__dirname}</p>
        `);
    }
});
// Ruta para favicon.ico
app.get('/favicon.ico', (req, res) => {
    const faviconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#9b59b6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#7d3c98;stop-opacity:1" />
            </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#bg)" stroke="#fff" stroke-width="2"/>
        <circle cx="38" cy="35" r="6" fill="white"/>
        <circle cx="62" cy="35" r="6" fill="white"/>
        <circle cx="38" cy="35" r="2" fill="#2c3e50"/>
        <circle cx="62" cy="35" r="2" fill="#2c3e50"/>
        <path d="M35 55 Q50 70 65 55" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
        <text x="50" y="85" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="white" font-weight="bold">LFP</text>
    </svg>`;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(faviconSVG);
});
// API endpoints para archivos
app.post('/api/save-file', (req, res) => {
    try {
        const { filename, content } = req.body;
        if (!filename || !content) {
            res.status(400).json({
                success: false,
                error: 'Filename and content are required'
            });
            return;
        }
        const filePath = path.join(PROJECT_ROOT, 'uploads', filename);
        // Crear directorio uploads si no existe
        const uploadsDir = path.join(PROJECT_ROOT, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        fs.writeFileSync(filePath, content);
        res.json({ success: true, message: 'Archivo guardado exitosamente' });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error guardando archivo:', errorMessage);
        res.status(500).json({ success: false, error: errorMessage });
    }
});
app.get('/api/load-file/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(PROJECT_ROOT, 'uploads', filename);
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ success: false, error: 'Archivo no encontrado' });
            return;
        }
        const content = fs.readFileSync(filePath, 'utf8');
        res.json({ success: true, content });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error cargando archivo:', errorMessage);
        res.status(500).json({ success: false, error: errorMessage });
    }
});
// Manejo de errores 404
app.use((req, res, next) => {
    console.log(`❌ Error 404: Archivo no encontrado - ${req.url}`);
    res.status(404).json({
        error: 'Archivo no encontrado',
        url: req.url,
        suggestion: 'Verifica que el archivo esté compilado en public/dist/'
    });
});
// Manejo de errores generales
app.use((error, req, res, next) => {
    console.error('Error del servidor:', error);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: error.message
    });
});
// Verificar que existan los directorios necesarios
const checkDirectories = () => {
    const requiredDirs = [
        path.join(PROJECT_ROOT, 'public'),
        path.join(PROJECT_ROOT, 'public/dist'),
        path.join(PROJECT_ROOT, 'uploads')
    ];
    requiredDirs.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`📁 Directorio creado: ${dir}`);
        }
    });
};
// Verificar archivos compilados
const checkCompiledFiles = () => {
    const distDir = path.join(PROJECT_ROOT, 'public/dist');
    if (!fs.existsSync(distDir)) {
        console.log('⚠️  Directorio dist no encontrado. Ejecuta: npm run build');
        return false;
    }
    const requiredFiles = [
        'main.js',
        'lexer/Lexer.js',
        'lexer/Token.js',
        'lexer/LexicalError.js',
        'pokemon/Pokemon.js',
        'pokemon/Player.js',
        'pokemon/TeamSelector.js',
        'api/PokeAPI.js',
        'reports/TokenReport.js',
        'reports/ErrorReport.js',
        'reports/TeamReport.js',
        'ui/FileHandler.js'
    ];
    const missingFiles = requiredFiles.filter((file) => !fs.existsSync(path.join(distDir, file)));
    if (missingFiles.length > 0) {
        console.log('⚠️  Archivos compilados faltantes:');
        missingFiles.forEach((file) => console.log(`   - public/dist/${file}`));
        console.log('💡 Ejecuta: npm run build');
        return false;
    }
    return true;
};
// Función para listar archivos compilados
const listCompiledFiles = () => {
    const distDir = path.join(PROJECT_ROOT, 'public/dist');
    if (fs.existsSync(distDir)) {
        console.log('📁 Archivos compilados encontrados:');
        const walkDir = (dir, prefix = '') => {
            const files = fs.readdirSync(dir);
            files.forEach((file) => {
                const fullPath = path.join(dir, file);
                const relativePath = path.relative(distDir, fullPath);
                if (fs.statSync(fullPath).isDirectory()) {
                    walkDir(fullPath, prefix + '  ');
                }
                else {
                    console.log(`   ✅ ${relativePath}`);
                }
            });
        };
        walkDir(distDir);
    }
};
// Inicializar servidor
const startServer = () => {
    console.log(`🔍 Directorio de trabajo: ${process.cwd()}`);
    console.log(`🔍 __dirname del servidor: ${__dirname}`);
    console.log(`🔍 PROJECT_ROOT: ${PROJECT_ROOT}`);
    checkDirectories();
    const compiledFilesExist = checkCompiledFiles();
    listCompiledFiles();
    app.listen(PORT, () => {
        console.log('🚀 ===================================');
        console.log('   Analizador Léxico Pokémon');
        console.log('   Universidad de San Carlos');
        console.log('===================================');
        console.log(`🌐 Servidor iniciado en: http://localhost:${PORT}`);
        console.log(`📁 Directorio público: ${path.join(PROJECT_ROOT, 'public')}`);
        if (compiledFilesExist) {
            console.log('✅ Archivos TypeScript compilados correctamente');
        }
        else {
            console.log('❌ Archivos TypeScript no compilados');
            console.log('💡 Ejecuta: npm run build');
        }
        console.log('⚡ Listo para recibir conexiones...');
        console.log('🎯 Servidor TypeScript con rutas corregidas');
    });
};
// Manejo de señales para cierre limpio
process.on('SIGTERM', () => {
    console.log('🛑 Servidor cerrando...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('\n🛑 Servidor interrumpido por el usuario');
    process.exit(0);
});
// Iniciar servidor
startServer();
//# sourceMappingURL=server.js.map