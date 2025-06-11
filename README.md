# Analizador Léxico Pokémon

Este proyecto implementa un analizador léxico para archivos de configuración de equipos Pokémon utilizando TypeScript.

## Características

- ✅ Analizador léxico implementado desde cero (sin regex)
- ✅ Autómata finito determinista para reconocimiento de patrones
- ✅ Interfaz gráfica web interactiva
- ✅ Resaltado de sintaxis en tiempo real
- ✅ Integración con PokeAPI para sprites
- ✅ Generación de reportes HTML
- ✅ Cálculo de IV's y selección automática de equipos
- ✅ Soporte para múltiples jugadores

## Instalación y Ejecución

### Requisitos
- Node.js 16+ 
- npm

### Pasos de instalación

1. **Crear el proyecto**
```bash
mkdir pokemon-lexer
cd pokemon-lexer
```

2. **Inicializar npm e instalar dependencias**
```bash
npm init -y
npm install typescript @types/node live-server rimraf --save-dev
```

3. **Crear estructura de carpetas**
```bash
mkdir -p src/{lexer,pokemon,reports,ui,api} public/reports
```

4. **Copiar archivos de código**
   - Copie todos los archivos .ts en sus carpetas correspondientes
   - Copie index.html y styles.css a la carpeta public/

5. **Configurar TypeScript**
   - Copie tsconfig.json al directorio raíz
   - Actualice package.json con los scripts

6. **Compilar y ejecutar**
```bash
npm run build
npm start
```

### Comandos disponibles

- `npm run build` - Compila TypeScript a JavaScript
- `npm run watch` - Compila en modo watch (recarga automática)
- `npm run dev` - Modo desarrollo (watch + servidor)
- `npm start` - Inicia el servidor de desarrollo
- `npm run clean` - Limpia archivos compilados

## Estructura del Proyecto

```
pokemon-lexer/
├── src/
│   ├── lexer/           # Analizador léxico
│   ├── pokemon/         # Clases del dominio
│   ├── reports/         # Generadores de reportes
│   ├── ui/              # Componentes de interfaz
│   ├── api/             # Servicios externos
│   └── main.ts          # Aplicación principal
├── public/
│   ├── index.html       # Interfaz web
│   ├── styles.css       # Estilos
│   └── dist/            # Código compilado
└── Archivos de configuración
```

## Uso de la Aplicación

1. **Cargar código**: Escriba directamente en el editor o cargue un archivo .pklfp
2. **Analizar**: Presione el botón "Analizar" para procesar el código
3. **Ver resultados**: 
   - Tokens se muestran en la tabla lateral
   - Reportes se abren en nuevas ventanas
   - Equipos se generan automáticamente si no hay errores

## Formato del Lenguaje

```
Jugador: "NombreJugador" {
    "pokemon_name"[tipo] := (
        [salud]=valor;
        [ataque]=valor;
        [defensa]=valor;
    )
}
```

## Tipos soportados
- agua, fuego, planta, normal, psiquico, dragon, bicho

## Características Técnicas

- **Autómata**: AFD de 8 estados implementado sin regex
- **Tokens**: 20+ tipos diferentes reconocidos
- **Errores**: Detección y reporte de errores léxicos
- **IV's**: Cálculo automático: (salud+ataque+defensa)/45*100
- **Selección**: Mejores 6 Pokémon evitando repetir tipos
- **API**: Integración con PokeAPI para sprites oficiales

## Notas Importantes

- El analizador no incluye parser sintáctico (solo léxico)
- Los archivos deben tener extensión .pklfp
- Se requiere conexión a internet para sprites de PokeAPI
- Compatible con navegadores modernos (ES2020+)