// server.js - Servidor Node.js para el Analizador Léxico Pokémon
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

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

// Servir archivos estáticos desde public
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        // Configurar MIME types para módulos ES6
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoints para archivos
app.post('/api/save-file', (req, res) => {
    try {
        const { filename, content } = req.body;
        const filePath = path.join(__dirname, 'uploads', filename);
        
        // Crear directorio uploads si no existe
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, content);
        res.json({ success: true, message: 'Archivo guardado exitosamente' });
    } catch (error) {
        console.error('Error guardando archivo:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/load-file/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, 'uploads', filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, error: 'Archivo no encontrado' });
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        res.json({ success: true, content });
    } catch (error) {
        console.error('Error cargando archivo:', error);
        res.status(500).json({ success: false, error: error.message });
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
        path.join(__dirname, 'public'),
        path.join(__dirname, 'public/dist'),
        path.join(__dirname, 'uploads')
    ];
    
    requiredDirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`📁 Directorio creado: ${dir}`);
        }
    });
};

// Verificar archivos compilados
const checkCompiledFiles = () => {
    const distDir = path.join(__dirname, 'public/dist');
    
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
    
    const missingFiles = requiredFiles.filter(file => 
        !fs.existsSync(path.join(distDir, file))
    );
    
    if (missingFiles.length > 0) {
        console.log('⚠️  Archivos compilados faltantes:');
        missingFiles.forEach(file => console.log(`   - public/dist/${file}`));
        console.log('💡 Ejecuta: npm run build');
        return false;
    }
    
    return true;
};

// Inicializar servidor
const startServer = () => {
    checkDirectories();
    
    const compiledFilesExist = checkCompiledFiles();
    
    app.listen(PORT, () => {
        console.log('🚀 ===================================');
        console.log('   Analizador Léxico Pokémon');
        console.log('   Universidad de San Carlos');
        console.log('===================================');
        console.log(`🌐 Servidor iniciado en: http://localhost:${PORT}`);
        console.log(`📁 Directorio público: ${path.join(__dirname, 'public')}`);
        
        if (compiledFilesExist) {
            console.log('✅ Archivos TypeScript compilados correctamente');
        } else {
            console.log('❌ Archivos TypeScript no compilados');
            console.log('💡 Ejecuta: npm run build');
        }
        
        console.log('⚡ Listo para recibir conexiones...');
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
