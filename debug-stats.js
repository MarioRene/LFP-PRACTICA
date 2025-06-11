// debug-stats.js - Script completo para debuggear el problema de estadísticas

console.log('🔍 DEBUGGING ESTADÍSTICAS POKÉMON');
console.log('=================================');

// Código de prueba mínimo
const debugCode = `Jugador: "TestPlayer" {
    "testmon"[agua] := (
        [salud]=10;
        [ataque]=20;
        [defensa]=30;
    )
}`;

console.log('📝 Código de prueba:');
console.log(debugCode);
console.log('\n🎯 Resultado esperado:');
console.log('testmon: Health=10, Attack=20, Defense=30');

// Función para debug en navegador
window.debugStatsComplete = async function() {
    console.log('\n🚀 INICIANDO DEBUG COMPLETO...');
    
    try {
        // Paso 1: Análisis léxico
        console.log('\n📋 PASO 1: ANÁLISIS LÉXICO');
        console.log('==========================');
        
        const { Lexer } = await import('./dist/lexer/Lexer.js');
        const lexer = new Lexer(debugCode);
        const { tokens, errors } = lexer.analyze();
        
        console.log(`📊 Tokens generados: ${tokens.length}`);
        console.log(`❌ Errores léxicos: ${errors.length}`);
        
        if (errors.length > 0) {
            console.error('🚨 ERRORES LÉXICOS ENCONTRADOS:');
            errors.forEach(error => console.error(`  - ${error.toString()}`));
            return;
        }
        
        // Mostrar todos los tokens
        console.log('\n📋 TODOS LOS TOKENS:');
        tokens.forEach((token, i) => {
            if (token.type !== 'Fin de Archivo') {
                console.log(`  ${i.toString().padStart(2, '0')}: "${token.lexeme}" (${token.type}) [${token.line}:${token.column}]`);
            }
        });
        
        // Verificar palabras reservadas específicas
        console.log('\n🎯 VERIFICACIÓN DE PALABRAS RESERVADAS:');
        const statsTokens = tokens.filter(t => ['salud', 'ataque', 'defensa'].includes(t.lexeme));
        console.log(`📊 Tokens de estadísticas encontrados: ${statsTokens.length}`);
        
        if (statsTokens.length === 0) {
            console.error('🚨 PROBLEMA CRÍTICO: No se encontraron tokens de estadísticas!');
            console.log('💡 Las palabras "salud", "ataque", "defensa" no se están reconociendo como palabras reservadas');
            return;
        }
        
        statsTokens.forEach(token => {
            console.log(`  ✅ "${token.lexeme}" -> ${token.type}`);
        });
        
        // Verificar números
        const numberTokens = tokens.filter(t => t.type === 'Número Entero');
        console.log(`\n🔢 Tokens numéricos encontrados: ${numberTokens.length}`);
        numberTokens.forEach(token => {
            console.log(`  📊 ${token.lexeme} (${token.type})`);
        });
        
        // Paso 2: Parsing de equipos
        console.log('\n📋 PASO 2: PARSING DE EQUIPOS');
        console.log('=============================');
        
        const { TeamSelector } = await import('./dist/pokemon/TeamSelector.js');
        const teamSelector = new TeamSelector(tokens);
        const players = teamSelector.parsePlayersAndPokemons();
        
        console.log(`👥 Jugadores parseados: ${players.length}`);
        
        if (players.length === 0) {
            console.error('🚨 PROBLEMA: No se parsearon jugadores');
            return;
        }
        
        const player = players[0];
        console.log(`\n👤 Jugador: ${player.name}`);
        console.log(`🎮 Pokémon del jugador: ${player.pokemons.length}`);
        
        if (player.pokemons.length === 0) {
            console.error('🚨 PROBLEMA: No se parsearon Pokémon');
            return;
        }
        
        const pokemon = player.pokemons[0];
        console.log(`\n🔹 Pokémon: ${pokemon.name}`);
        console.log(`🏷️  Tipo: ${pokemon.type}`);
        console.log(`💚 Salud: ${pokemon.health} (esperado: 10)`);
        console.log(`⚔️  Ataque: ${pokemon.attack} (esperado: 20)`);
        console.log(`🛡️  Defensa: ${pokemon.defense} (esperado: 30)`);
        console.log(`📈 IV: ${pokemon.calculateIV().toFixed(1)}% (esperado: 133.3%)`);
        
        // Paso 3: Diagnóstico final
        console.log('\n📋 PASO 3: DIAGNÓSTICO FINAL');
        console.log('============================');
        
        let allCorrect = true;
        
        if (pokemon.health !== 10) {
            console.error(`❌ SALUD INCORRECTA: obtuvo ${pokemon.health}, esperaba 10`);
            allCorrect = false;
        } else {
            console.log('✅ Salud correcta');
        }
        
        if (pokemon.attack !== 20) {
            console.error(`❌ ATAQUE INCORRECTO: obtuvo ${pokemon.attack}, esperaba 20`);
            allCorrect = false;
        } else {
            console.log('✅ Ataque correcto');
        }
        
        if (pokemon.defense !== 30) {
            console.error(`❌ DEFENSA INCORRECTA: obtuvo ${pokemon.defense}, esperaba 30`);
            allCorrect = false;
        } else {
            console.log('✅ Defensa correcta');
        }
        
        if (allCorrect) {
            console.log('\n🎉 ¡ÉXITO! Todas las estadísticas son correctas');
        } else {
            console.log('\n🚨 ¡FALLO! Algunas estadísticas son incorrectas');
            
            // Análisis del patrón de error
            if (pokemon.health === 30 && pokemon.attack === 0 && pokemon.defense === 0) {
                console.log('🔍 PATRÓN DETECTADO: La salud tiene el valor de la defensa, las demás son 0');
                console.log('💡 POSIBLE CAUSA: El parsing solo lee la última estadística y la asigna mal');
            } else if (pokemon.health === 0 || pokemon.attack === 0 || pokemon.defense === 0) {
                console.log('🔍 PATRÓN DETECTADO: Algunas estadísticas son 0');
                console.log('💡 POSIBLE CAUSA: El parsing no está leyendo todas las estadísticas');
            }
        }
        
        console.log('\n📋 RESUMEN DEL DIAGNÓSTICO:');
        console.log(`- Tokens generados: ${tokens.length > 0 ? '✅' : '❌'}`);
        console.log(`- Palabras reservadas reconocidas: ${statsTokens.length === 3 ? '✅' : '❌'}`);
        console.log(`- Números reconocidos: ${numberTokens.length >= 3 ? '✅' : '❌'}`);
        console.log(`- Jugador parseado: ${players.length > 0 ? '✅' : '❌'}`);
        console.log(`- Pokémon parseado: ${player.pokemons.length > 0 ? '✅' : '❌'}`);
        console.log(`- Estadísticas correctas: ${allCorrect ? '✅' : '❌'}`);
        
    } catch (error) {
        console.error('💥 ERROR EN DEBUG:', error);
        console.error(error.stack);
    }
};

console.log('\n💡 Para ejecutar el debug completo:');
console.log('1. Abre la consola del navegador (F12)');
console.log('2. Ejecuta: debugStatsComplete()');
console.log('3. Revisa los resultados paso a paso');

// También crear versión para copiar/pegar directamente
window.quickDebug = function() {
    debugStatsComplete();
};
