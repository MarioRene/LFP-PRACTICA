# 📚 Manual de Usuario
## Analizador Léxico Pokémon

**Universidad de San Carlos de Guatemala**  
**Facultad de Ingeniería**  
**Escuela de Ciencias y Sistemas**  
**Lenguajes Formales y de Programación**  
**Vacaciones de Junio 2025**

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Iniciando la Aplicación](#iniciando-la-aplicación)
5. [Interfaz de Usuario](#interfaz-de-usuario)
6. [Cómo Usar la Aplicación](#cómo-usar-la-aplicación)
7. [Lenguaje de Programación Pokémon](#lenguaje-de-programación-pokémon)
8. [Ejemplos de Uso](#ejemplos-de-uso)
9. [Reportes Generados](#reportes-generados)
10. [Solución de Problemas](#solución-de-problemas)
11. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🎯 Introducción

El **Analizador Léxico Pokémon** es una aplicación web diseñada para analizar código escrito en un lenguaje de programación especial para la creación de equipos Pokémon. La aplicación permite:

- ✅ **Analizar código** escrito en el lenguaje Pokémon
- ✅ **Detectar errores** léxicos en tiempo real
- ✅ **Seleccionar automáticamente** los mejores equipos Pokémon
- ✅ **Generar reportes** profesionales en HTML
- ✅ **Visualizar sprites** de Pokémon desde la PokeAPI

### 🎮 ¿Para qué sirve?

Game Freak necesitaba una herramienta para ayudar a jugadores competitivos a seleccionar los mejores equipos Pokémon basándose en estadísticas y tipos. Esta aplicación:

1. **Lee archivos** con definiciones de jugadores y sus Pokémon
2. **Calcula los IV's** (Individual Values) de cada Pokémon
3. **Selecciona automáticamente** los 6 mejores Pokémon del jugador
4. **Genera reportes visuales** con sprites de la PokeAPI

---

## 💻 Requisitos del Sistema

### Hardware Mínimo:
- **RAM**: 4 GB
- **Disco**: 500 MB de espacio libre
- **Procesador**: Dual-core 2.0 GHz

### Software Requerido:
- **Node.js**: Versión 16.0 o superior
- **NPM**: Versión 8.0 o superior
- **Navegador web**: Chrome, Firefox, Edge o Safari (versión reciente)
- **Sistema Operativo**: Windows 10/11, macOS 10.15+, o Linux Ubuntu 18.04+

### Verificar Instalación:
```bash
# Verificar Node.js
node --version

# Verificar NPM
npm --version
```

---

## 🚀 Instalación y Configuración

### Paso 1: Descargar el Proyecto
```bash
# Si tienes el código en un repositorio
git clone [URL-del-repositorio]
cd PRACTICAAnalizadorPokemon

# O extraer desde un archivo ZIP
# Descomprimir y navegar a la carpeta
```

### Paso 2: Instalar Dependencias
```bash
# Instalar todas las dependencias necesarias
npm install
```

### Paso 3: Compilar el Proyecto
```bash
# Compilar el código TypeScript
npm run build
```

### Paso 4: Verificar Instalación
```bash
# Verificar que los archivos se compilaron
dir public\dist /s    # Windows
# o
ls -la public/dist    # macOS/Linux
```

---

## ▶️ Iniciando la Aplicación

### Ejecutar el Servidor:
```bash
npm start
```

### Verificar que Funciona:
Después de ejecutar el comando, deberías ver:
```
🚀 ===================================
   Analizador Léxico Pokémon
   Universidad de San Carlos
===================================
🌐 Servidor iniciado en: http://localhost:8080
✅ Archivos TypeScript compilados correctamente
⚡ Listo para recibir conexiones...
```

### Abrir en el Navegador:
1. Abrir tu navegador web
2. Ir a: `http://localhost:8080`
3. La aplicación debería cargar automáticamente

---

## 🖥️ Interfaz de Usuario

### Barra de Navegación Superior:
- **🏠 Analizador Léxico Pokémon**: Logo y título de la aplicación
- **▶️ Analizar**: Botón principal para ejecutar el análisis
- **🗑️ Limpiar**: Limpia el editor de código
- **📁 Cargar**: Carga un archivo .pklfp desde tu computadora
- **💾 Guardar**: Guarda el código actual en un archivo .pklfp
- **📊 Tokens**: Muestra el reporte de tokens
- **❌ Errores**: Muestra el reporte de errores
- **👥 Equipos**: Muestra el reporte de equipos

### Barra de Estado:
- **📝 Líneas**: Número total de líneas en el editor
- **🏷️ Tokens**: Número de tokens reconocidos
- **⚠️ Errores**: Número de errores encontrados

### Panel Principal:
- **📝 Editor de Código**: Donde escribes o pegas el código Pokémon
- **📋 Panel de Resultados**: Muestra tokens, errores y equipos generados

### Pestañas del Panel de Resultados:
- **🏷️ Tokens**: Lista todos los tokens reconocidos
- **❌ Errores**: Lista errores léxicos encontrados
- **👥 Equipos**: Muestra vista previa de los equipos seleccionados

---

## 🎮 Cómo Usar la Aplicación

### Uso Básico:

#### 1. **Escribir o Cargar Código**
   - **Opción A**: Escribir directamente en el editor
   - **Opción B**: Usar el botón "📁 Cargar" para seleccionar un archivo .pklfp

#### 2. **Ejecutar Análisis**
   - Hacer clic en el botón "▶️ Analizar"
   - Esperar a que se complete el procesamiento

#### 3. **Revisar Resultados**
   - Si hay errores: Se mostrará la pestaña "❌ Errores"
   - Si no hay errores: Se mostrará la pestaña "👥 Equipos"

#### 4. **Ver Reportes**
   - Los reportes se abren automáticamente en nuevas ventanas
   - También puedes acceder con los botones de la barra superior

### Flujo de Trabajo Completo:

```
1. Escribir/Cargar código → 2. Analizar → 3. Revisar errores → 4. Ver equipos → 5. Guardar archivo
```

---

## 📖 Lenguaje de Programación Pokémon

### Estructura Básica:
```
Jugador: "NombreDelJugador" {
    "NombrePokemon"[Tipo] := (
        [salud]=valor;
        [ataque]=valor;
        [defensa]=valor;
    )
    // Más Pokémon...
}
```

### Elementos del Lenguaje:

#### **Palabras Reservadas:**
- `Jugador`: Define un nuevo jugador
- `salud`: Estadística de salud del Pokémon
- `ataque`: Estadística de ataque del Pokémon
- `defensa`: Estadística de defensa del Pokémon

#### **Tipos de Pokémon:**
- `agua`, `fuego`, `planta`, `normal`, `psiquico`, `dragon`, `bicho`

#### **Símbolos Especiales:**
- `:` - Dos puntos (después de Jugador)
- `:=` - Asignación (para definir Pokémon)
- `{}` - Llaves (delimitan bloque de jugador)
- `[]` - Corchetes (delimitan tipos y estadísticas)
- `()` - Paréntesis (delimitan estadísticas)
- `;` - Punto y coma (termina cada estadística)
- `=` - Igual (asigna valor a estadística)

#### **Tipos de Datos:**
- **Cadenas de texto**: Entre comillas dobles `"texto"`
- **Números enteros**: Valores numéricos como `12`, `15`, `8`

### Reglas Sintácticas:

1. **Un jugador** puede tener **múltiples Pokémon**
2. **Cada Pokémon** debe tener **exactamente 3 estadísticas**
3. **Los nombres** van entre **comillas dobles**
4. **Los tipos** van entre **corchetes**
5. **Los valores** deben ser **números enteros**
6. **Cada estadística** termina con **punto y coma**

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Jugador Básico
```
Jugador: "PokeEvee" {
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
}
```

### Ejemplo 2: Jugador con Equipo Completo
```
Jugador: "MaestroAsh" {
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
    "snorlax"[normal] := (
        [salud]=18;
        [ataque]=12;
        [defensa]=14;
    )
    "butterfree"[bicho] := (
        [salud]=14;
        [ataque]=13;
        [defensa]=15;
    )
    "blastoise"[agua] := (
        [salud]=15;
        [ataque]=12;
        [defensa]=14;
    )
    "victreebel"[planta] := (
        [salud]=15;
        [ataque]=14;
        [defensa]=14;
    )
    "flareon"[fuego] := (
        [salud]=12;
        [ataque]=15;
        [defensa]=14;
    )
}
```

### Ejemplo 3: Múltiples Jugadores
```
Jugador: "Jugador1" {
    "pokemon1"[agua] := (
        [salud]=10;
        [ataque]=12;
        [defensa]=14;
    )
}

Jugador: "Jugador2" {
    "pokemon2"[fuego] := (
        [salud]=15;
        [ataque]=18;
        [defensa]=12;
    )
}
```

---

## 📊 Reportes Generados

### 1. **Reporte de Tokens**
- **Propósito**: Mostrar todos los elementos reconocidos del código
- **Contiene**: Número, línea, columna, lexema y tipo de cada token
- **Uso**: Verificar que el análisis léxico sea correcto

### 2. **Reporte de Errores Léxicos**
- **Propósito**: Mostrar caracteres no reconocidos o errores de sintaxis
- **Contiene**: Línea, columna, carácter problemático y descripción
- **Uso**: Corregir errores en el código antes de continuar

### 3. **Reporte de Equipos Pokémon**
- **Propósito**: Mostrar los equipos seleccionados con sprites visuales
- **Contiene**: 
  - Nombre del jugador
  - Los 6 mejores Pokémon seleccionados
  - Estadísticas de cada Pokémon
  - IV calculado para cada Pokémon
  - Sprites obtenidos de la PokeAPI
- **Uso**: Ver el resultado final del análisis

### Cómo Interpretar los IV's:
- **IV = (Salud + Ataque + Defensa) / 45 * 100**
- **90-100%**: Excelente Pokémon
- **80-89%**: Muy bueno
- **70-79%**: Bueno
- **60-69%**: Regular
- **<60%**: Pobre

---

## 🛠️ Solución de Problemas

### Problema: "Error al cargar la aplicación"
**Solución:**
```bash
# Verificar que Node.js esté instalado
node --version

# Reinstalar dependencias
npm install

# Recompilar
npm run build

# Ejecutar nuevamente
npm start
```

### Problema: "No se muestran los sprites de Pokémon"
**Causa**: Problemas de conexión a internet o PokeAPI
**Solución:**
- Verificar conexión a internet
- Los sprites por defecto se mostrarán automáticamente

### Problema: "Error 404 en archivos .js"
**Solución:**
```bash
# Recompilar el proyecto
npm run clean
npm run build
npm start
```

### Problema: "Errores léxicos inesperados"
**Verifica:**
- Que los nombres estén entre comillas dobles
- Que los tipos estén entre corchetes
- Que cada estadística termine con punto y coma
- Que no haya caracteres especiales no permitidos

### Problema: "No se generan equipos"
**Causa**: Errores léxicos en el código
**Solución:**
1. Revisar la pestaña "Errores"
2. Corregir todos los errores mostrados
3. Volver a ejecutar el análisis

---

## ❓ Preguntas Frecuentes

### **¿Qué archivos puedo cargar?**
Solo archivos con extensión `.pklfp` que contengan código válido del lenguaje Pokémon.

### **¿Cuántos Pokémon puede tener un jugador?**
Un jugador puede tener cualquier cantidad de Pokémon, pero solo se seleccionarán los 6 mejores.

### **¿Cómo se seleccionan los mejores Pokémon?**
Se calculan los IV's de todos los Pokémon y se seleccionan los 6 con mayor porcentaje, priorizando diversidad de tipos.

### **¿Qué pasa si dos Pokémon tienen el mismo tipo?**
El sistema selecciona el Pokémon con mayor IV del tipo duplicado.

### **¿Puedo usar mayúsculas y minúsculas indistintamente?**
No, el lenguaje es sensible a mayúsculas y minúsculas. Usa exactamente como se muestra en los ejemplos.

### **¿Qué hacer si no tengo internet?**
La aplicación funcionará, pero se mostrarán sprites por defecto en lugar de los sprites reales de la PokeAPI.

### **¿Puedo tener múltiples jugadores en un archivo?**
Sí, puedes definir múltiples jugadores en el mismo archivo.

### **¿Cómo guardo mi trabajo?**
Usa el botón "💾 Guardar" para descargar tu código como archivo .pklfp.

---

## 📞 Soporte Técnico

Si tienes problemas que no se resuelven con este manual:

1. **Verifica** que cumples todos los requisitos del sistema
2. **Revisa** la sección de solución de problemas
3. **Consulta** los ejemplos para verificar la sintaxis correcta
4. **Verifica** la consola del navegador (F12) para errores adicionales

---

## 📋 Resumen de Comandos

```bash
# Instalación inicial
npm install
npm run build

# Ejecutar aplicación
npm start

# Limpiar y recompilar
npm run clean
npm run build

# Verificar compilación
dir public\dist /s    # Windows
ls -la public/dist    # macOS/Linux
```

---

**¡Disfruta creando los mejores equipos Pokémon con nuestra aplicación!** 🎮✨