/**
 * ============================================================================
 * LABORATORIO: TECNOLOGÍAS JAVASCRIPT Y AJAX
 * Módulo: Ejercicios de JavaScript (Criterios 1, 2, 3 y 4)
 * ============================================================================
 */

// ============================================================================
// CRITERIO 1: EJERCICIO JS 1 - DETECTAR PALÍNDROMO
// ============================================================================
/**
 * Normaliza una cadena de texto para la comprobación de palíndromos:
 * 1. Convierte a minúsculas.
 * 2. Descompone caracteres con acentos/tildes y diéresis mediante NFD y los elimina.
 * 3. Remueve signos de puntuación, espacios y símbolos no alfanuméricos.
 * 
 * @param {string} texto - Cadena original
 * @returns {string} Cadena normalizada
 */
function normalizarTexto(texto) {
    if (typeof texto !== 'string') return '';
    return texto
        .toLowerCase()
        // NFD separa letras de sus diacríticos (ej: "á" -> "a" + acento agudo)
        .normalize('NFD')
        // Elimina los diacríticos en el rango Unicode correspondiente
        .replace(/[\u0300-\u036f]/g, '')
        // Elimina espacios, signos de puntuación y cualquier caracter que no sea alfanumérico
        .replace(/[^a-z0-9]/gi, '');
}

/**
 * Invierte una cadena de texto.
 * @param {string} cadena 
 * @returns {string} Cadena invertida
 */
function invertirCadena(cadena) {
    return cadena.split('').reverse().join('');
}

/**
 * Evalúa si una cadena es un palíndromo.
 * @param {string} entrada - Texto a evaluar
 * @returns {object} Objeto con el resultado del análisis y detalles
 */
function evaluarPalindromo(entrada) {
    if (!entrada || entrada.trim() === '') {
        return {
            esValido: false,
            esPalindromo: false,
            mensaje: 'Por favor, introduce una cadena de texto válida.',
            original: entrada,
            limpia: '',
            invertida: ''
        };
    }

    const limpia = normalizarTexto(entrada);
    if (limpia.length === 0) {
        return {
            esValido: false,
            esPalindromo: false,
            mensaje: 'La cadena no contiene caracteres alfanuméricos evaluables.',
            original: entrada,
            limpia: '',
            invertida: ''
        };
    }

    const invertida = invertirCadena(limpia);
    const esPalindromo = (limpia === invertida);

    return {
        esValido: true,
        esPalindromo: esPalindromo,
        original: entrada,
        limpia: limpia,
        invertida: invertida,
        longitud: limpia.length,
        mensaje: esPalindromo
            ? `¡SÍ es un palíndromo! Se lee exactamente igual en ambos sentidos.`
            : `NO es un palíndromo. Al invertirse cambia el contenido.`
    };
}

/**
 * Manejador del botón en la interfaz para el Ejercicio 1
 */
function ejecutarEjercicio1() {
    const input = document.getElementById('js1-input');
    const valor = input ? input.value : '';
    const resultado = evaluarPalindromo(valor);
    mostrarResultadoJS1(resultado);
}

/**
 * Permite ejecutar el Ejercicio 1 mediante prompt() interactivo
 */
function ejecutarEjercicio1Prompt() {
    const entrada = prompt('Ejercicio 1: Introduce una frase o palabra para comprobar si es un palíndromo:', 'Anita lava la tina');
    if (entrada !== null) {
        const input = document.getElementById('js1-input');
        if (input) input.value = entrada;
        const resultado = evaluarPalindromo(entrada);
        mostrarResultadoJS1(resultado);
        alert(`Resultado:\n${resultado.mensaje}\nOriginal: "${entrada}"\nNormalizada: "${resultado.limpia}"\nInvertida: "${resultado.invertida}"`);
    }
}

function mostrarResultadoJS1(res) {
    const contenedor = document.getElementById('js1-resultado');
    if (!contenedor) return;

    if (!res.esValido) {
        contenedor.className = 'resultado-box alert-warning';
        contenedor.innerHTML = `<strong>Atención:</strong> ${res.mensaje}`;
        return;
    }

    const clase = res.esPalindromo ? 'alert-success' : 'alert-danger';
    const icono = res.esPalindromo ? '✔' : '✖';

    contenedor.className = `resultado-box ${clase}`;
    contenedor.innerHTML = `
        <div class="resultado-header">
            <span class="badge ${res.esPalindromo ? 'badge-success' : 'badge-danger'}">
                ${icono} ${res.esPalindromo ? 'ES PALÍNDROMO' : 'NO ES PALÍNDROMO'}
            </span>
            <p class="resultado-msg">${res.mensaje}</p>
        </div>
        <div class="resultado-detalles">
            <div><span class="lbl">Texto original:</span> <span class="val">"${res.original}"</span></div>
            <div><span class="lbl">Texto normalizado:</span> <span class="val code-font">${res.limpia}</span></div>
            <div><span class="lbl">Texto invertido:</span> <span class="val code-font">${res.invertida}</span></div>
            <div><span class="lbl">Longitud evaluada:</span> <span class="val">${res.longitud} caracteres</span></div>
        </div>
    `;
}


// ============================================================================
// CRITERIO 2: EJERCICIO JS 2 - NÚMERO MAYOR ENTRE DOS
// ============================================================================
/**
 * Compara dos números y determina cuál es mayor o si son iguales.
 * @param {number|string} n1 
 * @param {number|string} n2 
 * @returns {object} Objeto con resultado y descripción
 */
function compararDosNumeros(n1, n2) {
    const num1 = parseFloat(n1);
    const num2 = parseFloat(n2);

    if (isNaN(num1) || isNaN(num2)) {
        return {
            esValido: false,
            mensaje: 'Por favor, ingresa dos números válidos para realizar la comparación.'
        };
    }

    let mayor = null;
    let menor = null;
    let sonIguales = false;
    let mensaje = '';

    if (num1 > num2) {
        mayor = num1;
        menor = num2;
        mensaje = `El primer número (${num1}) es MAYOR que el segundo número (${num2}).`;
    } else if (num2 > num1) {
        mayor = num2;
        menor = num1;
        mensaje = `El segundo número (${num2}) es MAYOR que el primer número (${num1}).`;
    } else {
        sonIguales = true;
        mayor = num1;
        menor = num2;
        mensaje = `Ambos números son IGUALES (${num1} = ${num2}).`;
    }

    return {
        esValido: true,
        num1: num1,
        num2: num2,
        mayor: mayor,
        menor: menor,
        sonIguales: sonIguales,
        diferencia: Math.abs(num1 - num2),
        mensaje: mensaje
    };
}

/**
 * Manejador del botón en la interfaz para el Ejercicio 2
 */
function ejecutarEjercicio2() {
    const input1 = document.getElementById('js2-num1');
    const input2 = document.getElementById('js2-num2');
    const v1 = input1 ? input1.value : '';
    const v2 = input2 ? input2.value : '';

    const resultado = compararDosNumeros(v1, v2);
    mostrarResultadoJS2(resultado);
}

/**
 * Permite ejecutar el Ejercicio 2 mediante dos prompt() sucesivos
 */
function ejecutarEjercicio2Prompt() {
    const v1 = prompt('Ejercicio 2: Introduce el PRIMER número:');
    if (v1 === null) return;
    const v2 = prompt('Ejercicio 2: Introduce el SEGUNDO número:');
    if (v2 === null) return;

    const input1 = document.getElementById('js2-num1');
    const input2 = document.getElementById('js2-num2');
    if (input1) input1.value = v1;
    if (input2) input2.value = v2;

    const resultado = compararDosNumeros(v1, v2);
    mostrarResultadoJS2(resultado);
    alert(`Resultado:\n${resultado.mensaje}`);
}

function mostrarResultadoJS2(res) {
    const contenedor = document.getElementById('js2-resultado');
    if (!contenedor) return;

    if (!res.esValido) {
        contenedor.className = 'resultado-box alert-warning';
        contenedor.innerHTML = `<strong>Error de entrada:</strong> ${res.mensaje}`;
        return;
    }

    contenedor.className = 'resultado-box alert-info';
    let detalleComparacion = '';
    if (res.sonIguales) {
        detalleComparacion = `<span class="badge badge-info">IGUALES</span> <strong>${res.num1}</strong> es igual a <strong>${res.num2}</strong>`;
    } else {
        detalleComparacion = `<span class="badge badge-primary">MAYOR: ${res.mayor}</span> (Diferencia: ${res.diferencia})`;
    }

    contenedor.innerHTML = `
        <div class="resultado-header">
            <p class="resultado-msg font-lg">${res.mensaje}</p>
        </div>
        <div class="resultado-detalles">
            <div><span class="lbl">Número 1:</span> <span class="val font-bold">${res.num1}</span></div>
            <div><span class="lbl">Número 2:</span> <span class="val font-bold">${res.num2}</span></div>
            <div><span class="lbl">Conclusión:</span> <span class="val">${detalleComparacion}</span></div>
        </div>
    `;
}


// ============================================================================
// CRITERIO 3: EJERCICIO JS 3 - VOCALES QUE APARECEN EN UNA FRASE
// ============================================================================
/**
 * Normaliza una vocal considerando posibles tildes o diéresis.
 * @param {string} letra 
 * @returns {string|null} Vocal base ('a', 'e', 'i', 'o', 'u') o null si no es vocal
 */
function normalizarVocal(letra) {
    const mapa = {
        'a': 'a', 'á': 'a', 'à': 'a', 'ä': 'a',
        'e': 'e', 'é': 'e', 'è': 'e', 'ë': 'e',
        'i': 'i', 'í': 'i', 'ì': 'i', 'ï': 'i',
        'o': 'o', 'ó': 'o', 'ò': 'o', 'ö': 'o',
        'u': 'u', 'ú': 'u', 'ù': 'u', 'ü': 'u'
    };
    return mapa[letra.toLowerCase()] || null;
}

/**
 * Obtiene las vocales únicas que aparecen en una frase dada.
 * @param {string} frase 
 * @returns {object} Objeto con las vocales únicas encontradas y datos
 */
function obtenerVocalesQueAparecen(frase) {
    if (typeof frase !== 'string' || frase.trim() === '') {
        return {
            esValido: false,
            mensaje: 'Por favor, escribe una frase para extraer sus vocales.'
        };
    }

    const vocalesEncontradas = new Set();
    const ordenAparicion = [];

    for (let i = 0; i < frase.length; i++) {
        const char = frase[i];
        const vocalBase = normalizarVocal(char);
        if (vocalBase && !vocalesEncontradas.has(vocalBase)) {
            vocalesEncontradas.add(vocalBase);
            ordenAparicion.push(vocalBase);
        }
    }

    const vocalesOrdenadas = ['a', 'e', 'i', 'o', 'u'].filter(v => vocalesEncontradas.has(v));

    return {
        esValido: true,
        fraseOriginal: frase,
        vocales: vocalesOrdenadas,
        ordenAparicion: ordenAparicion,
        totalDistintas: vocalesOrdenadas.length,
        mensaje: vocalesOrdenadas.length > 0
            ? `Se encontraron ${vocalesOrdenadas.length} vocales distintas: ${vocalesOrdenadas.join(', ').toUpperCase()}`
            : `No se encontró ninguna vocal en la frase ingresada.`
    };
}

/**
 * Manejador del botón en la interfaz para el Ejercicio 3
 */
function ejecutarEjercicio3() {
    const input = document.getElementById('js3-frase');
    const valor = input ? input.value : '';
    const resultado = obtenerVocalesQueAparecen(valor);
    mostrarResultadoJS3(resultado);
}

/**
 * Permite ejecutar el Ejercicio 3 mediante prompt()
 */
function ejecutarEjercicio3Prompt() {
    const frase = prompt('Ejercicio 3: Introduce una frase para ver qué vocales aparecen:', 'La programación web con JavaScript es fascinante');
    if (frase !== null) {
        const input = document.getElementById('js3-frase');
        if (input) input.value = frase;
        const resultado = obtenerVocalesQueAparecen(frase);
        mostrarResultadoJS3(resultado);
        alert(`Resultado:\n${resultado.mensaje}`);
    }
}

function mostrarResultadoJS3(res) {
    const contenedor = document.getElementById('js3-resultado');
    if (!contenedor) return;

    if (!res.esValido) {
        contenedor.className = 'resultado-box alert-warning';
        contenedor.innerHTML = `<strong>Atención:</strong> ${res.mensaje}`;
        return;
    }

    if (res.totalDistintas === 0) {
        contenedor.className = 'resultado-box alert-warning';
        contenedor.innerHTML = `
            <div class="resultado-header">
                <span class="badge badge-warning">Sin vocales</span>
                <p class="resultado-msg">${res.mensaje}</p>
            </div>
            <div class="resultado-detalles">
                <div><span class="lbl">Frase evaluada:</span> <span class="val">"${res.fraseOriginal}"</span></div>
            </div>
        `;
        return;
    }

    contenedor.className = 'resultado-box alert-success';
    const chipsVocales = res.vocales
        .map(v => `<span class="vocal-chip">${v.toUpperCase()}</span>`)
        .join(' ');

    contenedor.innerHTML = `
        <div class="resultado-header">
            <span class="badge badge-success">${res.totalDistintas} vocales encontradas</span>
            <p class="resultado-msg">${res.mensaje}</p>
        </div>
        <div class="resultado-detalles">
            <div><span class="lbl">Frase:</span> <span class="val">"${res.fraseOriginal}"</span></div>
            <div style="margin-top: 8px;"><span class="lbl">Vocales que aparecen:</span> <div class="chips-container">${chipsVocales}</div></div>
            <div style="margin-top: 6px;"><span class="lbl">Orden de aparición:</span> <span class="val code-font">[ ${res.ordenAparicion.join(' -> ').toUpperCase()} ]</span></div>
        </div>
    `;
}


// ============================================================================
// CRITERIO 4: EJERCICIO JS 4 - CONTEO DE VECES QUE APARECE CADA VOCAL
// ============================================================================
/**
 * Cuenta la frecuencia de aparición de cada una de las 5 vocales en una frase.
 * @param {string} frase 
 * @returns {object} Desglose detallado por vocal y total
 */
function contarFrecuenciaVocales(frase) {
    if (typeof frase !== 'string' || frase.trim() === '') {
        return {
            esValido: false,
            mensaje: 'Por favor, escribe una frase para contar la frecuencia de cada vocal.'
        };
    }

    const conteo = { a: 0, e: 0, i: 0, o: 0, u: 0 };
    let totalVocales = 0;

    for (let i = 0; i < frase.length; i++) {
        const char = frase[i];
        const v = normalizarVocal(char);
        if (v && conteo.hasOwnProperty(v)) {
            conteo[v]++;
            totalVocales++;
        }
    }

    return {
        esValido: true,
        fraseOriginal: frase,
        conteo: conteo,
        totalVocales: totalVocales,
        longitudTexto: frase.length,
        mensaje: totalVocales > 0
            ? `Se contabilizaron un total de ${totalVocales} vocales en el texto.`
            : `El texto analizado no contiene ninguna vocal.`
    };
}

/**
 * Manejador del botón en la interfaz para el Ejercicio 4
 */
function ejecutarEjercicio4() {
    const input = document.getElementById('js4-frase');
    const valor = input ? input.value : '';
    const resultado = contarFrecuenciaVocales(valor);
    mostrarResultadoJS4(resultado);
}

/**
 * Permite ejecutar el Ejercicio 4 mediante prompt()
 */
function ejecutarEjercicio4Prompt() {
    const frase = prompt('Ejercicio 4: Introduce una frase para contar cuántas veces aparece cada vocal:', 'El murciélago comía higos y uvas');
    if (frase !== null) {
        const input = document.getElementById('js4-frase');
        if (input) input.value = frase;
        const resultado = contarFrecuenciaVocales(frase);
        mostrarResultadoJS4(resultado);
        const c = resultado.conteo;
        alert(`Conteo de Vocales:\nTotal: ${resultado.totalVocales}\nA / a: ${c.a}\nE / e: ${c.e}\nI / i: ${c.i}\nO / o: ${c.o}\nU / u: ${c.u}`);
    }
}

function mostrarResultadoJS4(res) {
    const contenedor = document.getElementById('js4-resultado');
    if (!contenedor) return;

    if (!res.esValido) {
        contenedor.className = 'resultado-box alert-warning';
        contenedor.innerHTML = `<strong>Atención:</strong> ${res.mensaje}`;
        return;
    }

    contenedor.className = 'resultado-box alert-info';
    const c = res.conteo;
    const total = res.totalVocales;

    // Generar barras visuales de frecuencia
    const vocales = ['a', 'e', 'i', 'o', 'u'];
    const cardsHTML = vocales.map(v => {
        const cantidad = c[v];
        const pct = total > 0 ? ((cantidad / total) * 100).toFixed(1) : 0;
        return `
            <div class="vocal-stat-card">
                <div class="vocal-letter">${v.toUpperCase()}</div>
                <div class="vocal-count">${cantidad}</div>
                <div class="vocal-bar-bg">
                    <div class="vocal-bar-fill fill-${v}" style="width: ${pct}%"></div>
                </div>
                <div class="vocal-pct">${pct}%</div>
            </div>
        `;
    }).join('');

    contenedor.innerHTML = `
        <div class="resultado-header">
            <span class="badge badge-info">Total vocales: ${total}</span>
            <p class="resultado-msg">${res.mensaje}</p>
        </div>
        <div class="vocal-stats-grid">
            ${cardsHTML}
        </div>
        <div class="resultado-detalles" style="margin-top: 12px;">
            <div><span class="lbl">Frase analizada:</span> <span class="val">"${res.fraseOriginal}"</span></div>
            <div><span class="lbl">Caracteres totales:</span> <span class="val">${res.longitudTexto} (Densidad vocálica: ${res.longitudTexto > 0 ? ((total / res.longitudTexto) * 100).toFixed(1) : 0}%)</span></div>
        </div>
    `;
}

// ============================================================================
// FUNCIONES AUXILIARES: EJEMPLOS PRECARGADOS
// ============================================================================
function cargarEjemploJS1(ejemplo) {
    const input = document.getElementById('js1-input');
    if (input) {
        input.value = ejemplo;
        ejecutarEjercicio1();
    }
}

function cargarEjemploJS2(n1, n2) {
    const in1 = document.getElementById('js2-num1');
    const in2 = document.getElementById('js2-num2');
    if (in1 && in2) {
        in1.value = n1;
        in2.value = n2;
        ejecutarEjercicio2();
    }
}

function cargarEjemploJS3(frase) {
    const input = document.getElementById('js3-frase');
    if (input) {
        input.value = frase;
        ejecutarEjercicio3();
    }
}

function cargarEjemploJS4(frase) {
    const input = document.getElementById('js4-frase');
    if (input) {
        input.value = frase;
        ejecutarEjercicio4();
    }
}
