const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DEL PROYECTO POKÉMON LEXER');
console.log('==========================================\n');

const projectRoot = __dirname;

// 1. Verificar estructura de directorios
console.log('📁 1. ESTRUCTURA DE DIRECTORIOS:');
const requiredDirs = [
    'src',
    'public',
    'public/dist',
    'uploads'
];

requiredDirs.forEach(dir => {
    const fullPath = path.join(projectRoot, dir);
    const exists = fs.existsSync(fullPath);
    console.log(`   ${exists ? '✅' : '❌'} ${dir}${exists ? '' : ' (FALTANTE)'}`);
});

// 2. Verificar archivos fuente TypeScript
console.log('\n📝 2. ARCHIVOS FUENTE TYPESCRIPT:');
const srcDir = path.join(projectRoot, 'src');
if (fs.existsSync(srcDir)) {
    const walkDir = (dir, prefix = '') => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const relativePath = path.relative(srcDir, fullPath);
            if (fs.statSync(fullPath).isDirectory()) {
                walkDir(fullPath, prefix + '  ');
            } else if (file.endsWith('.ts')) {
                console.log(`   ✅ ${relativePath}`);
            }
        });
    };
    walkDir(srcDir);
} else {
    console.log('   ❌ Directorio src no encontrado');
}

// 3. Verificar archivos compilados
console.log('\n🔨 3. ARCHIVOS COMPILADOS (.js):');
const distDir = path.join(projectRoot, 'public/dist');
if (fs.existsSync(distDir)) {
    const walkDir = (dir, prefix = '') => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const relativePath = path.relative(distDir, fullPath);
            if (fs.statSync(fullPath).isDirectory()) {
                walkDir(fullPath, prefix + '  ');
            } else if (file.endsWith('.js')) {
                const stats = fs.statSync(fullPath);
                console.log(`   ✅ ${relativePath} (${(stats.size / 1024).toFixed(1)}KB)`);
            }
        });
    };
    walkDir(distDir);
} else {
    console.log('   ❌ Directorio public/dist no encontrado');
}

// 4. Verificar archivos de configuración
console.log('\n⚙️  4. ARCHIVOS DE CONFIGURACIÓN:');
const configFiles = [
    'package.json',
    'tsconfig.json',
    'server.js'
];

configFiles.forEach(file => {
    const fullPath = path.join(projectRoot, file);
    const exists = fs.existsSync(fullPath);
    console.log(`   ${exists ? '✅' : '❌'} ${file}${exists ? '' : ' (FALTANTE)'}`);
});

// 5. Verificar dependencias en package.json
console.log('\n📦 5. DEPENDENCIAS:');
const packageJsonPath = path.join(projectRoot, 'package.json');
if (fs.existsSync(packageJsonPath)) {
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        console.log('   Dependencias principales:');
        if (packageJson.dependencies) {
            Object.keys(packageJson.dependencies).forEach(dep => {
                console.log(`     ✅ ${dep}: ${packageJson.dependencies[dep]}`);
            });
        } else {
            console.log('     ❌ No hay dependencias principales');
        }
        
        console.log('   Dependencias de desarrollo:');
        if (packageJson.devDependencies) {
            Object.keys(packageJson.devDependencies).forEach(dep => {
                console.log(`     ✅ ${dep}: ${packageJson.devDependencies[dep]}`);
            });
        } else {
            console.log('     ❌ No hay dependencias de desarrollo');
        }
    } catch (error) {
        console.log('   ❌ Error leyendo package.json:', error.message);
    }
} else {
    console.log('   ❌ package.json no encontrado');
}

// 6. Verificar node_modules
console.log('\n📚 6. NODE_MODULES:');
const nodeModulesPath = path.join(projectRoot, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
    const nodeModulesStats = fs.statSync(nodeModulesPath);
    const items = fs.readdirSync(nodeModulesPath).length;
    console.log(`   ✅ node_modules existe con ${items} paquetes`);
    
    // Verificar paquetes críticos
    const criticalPackages = ['express', 'cors', 'typescript'];
    criticalPackages.forEach(pkg => {
        const pkgPath = path.join(nodeModulesPath, pkg);
        const exists = fs.existsSync(pkgPath);
        console.log(`     ${exists ? '✅' : '❌'} ${pkg}`);
    });
} else {
    console.log('   ❌ node_modules no encontrado - ejecuta: npm install');
}

// 7. Sugerencias de solución
console.log('\n💡 7. SUGERENCIAS:');

const distExists = fs.existsSync(distDir);
const nodeModulesExists = fs.existsSync(nodeModulesPath);

if (!nodeModulesExists) {
    console.log('   🔧 Ejecuta: npm install');
}

if (!distExists) {
    console.log('   🔧 Ejecuta: npm run build');
}

if (distExists) {
    const jsFiles = [];
    const walkDir = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walkDir(fullPath);
            } else if (file.endsWith('.js')) {
                jsFiles.push(fullPath);
            }
        });
    };
    walkDir(distDir);
    
    if (jsFiles.length === 0) {
        console.log('   🔧 No hay archivos .js compilados - ejecuta: npm run build');
    } else {
        console.log('   ✅ Archivos compilados encontrados');
        console.log('   🔧 Si hay errores 404, verifica las rutas en el navegador');
    }
}

console.log('\n🚀 Para ejecutar el proyecto:');
console.log('   1. npm install (si node_modules no existe)');
console.log('   2. npm run build (para compilar TypeScript)');
console.log('   3. npm start (para ejecutar el servidor)');
console.log('   4. Abrir http://localhost:8080 en el navegador');

console.log('\n==========================================');
console.log('🏁 DIAGNÓSTICO COMPLETADO');
