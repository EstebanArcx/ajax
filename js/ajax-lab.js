/**
 * ============================================================================
 * LABORATORIO: TECNOLOGÍAS JAVASCRIPT Y AJAX
 * Módulo: Laboratorio AJAX (Criterios 5, 6, 7, 8 y 9)
 * ============================================================================
 * Implementación fiel y extendida del ejercicio clásico de Javier Eguíluz
 * ("Introducción a AJAX", Capítulo 7 / Ejercicio 11).
 */

// Constantes estándar para los 5 estados del objeto XMLHttpRequest (readyState)
var READY_STATE_UNINITIALIZED = 0; // 0: UNSENT / UNINITIALIZED (No inicializada)
var READY_STATE_LOADING       = 1; // 1: OPENED / LOADING (Cargando)
var READY_STATE_LOADED        = 2; // 2: HEADERS_RECEIVED / LOADED (Cabeceras recibidas)
var READY_STATE_INTERACTIVE   = 3; // 3: LOADING / INTERACTIVE (Interactiva / descargando datos)
var READY_STATE_COMPLETE      = 4; // 4: DONE / COMPLETE (Completada)

// Variable global para almacenar la instancia del objeto XMLHttpRequest
var peticion_http = null;

// Variable para registrar el tiempo inicial y calcular milisegundos transcurridos
var tiempoInicioPeticion = 0;

/**
 * Función constructora compatible para instanciar el objeto XMLHttpRequest,
 * soportando navegadores modernos (W3C standard) y versiones antiguas de IE (ActiveX).
 * 
 * @returns {XMLHttpRequest|ActiveXObject|null}
 */
function inicializa_xhr() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e2) {
                return null;
            }
        }
    }
    return null;
}

/**
 * Obtiene una marca de tiempo formateada (HH:MM:SS.mmm)
 * @returns {string}
 */
function obtenerMarcaTiempo() {
    var ahora = new Date();
    var h = String(ahora.getHours()).padStart(2, '0');
    var m = String(ahora.getMinutes()).padStart(2, '0');
    var s = String(ahora.getSeconds()).padStart(2, '0');
    var ms = String(ahora.getMilliseconds()).padStart(3, '0');
    return h + ":" + m + ":" + s + "." + ms;
}

/**
 * Obtiene el tiempo transcurrido desde el inicio de la petición
 * @returns {string}
 */
function obtenerTiempoTranscurrido() {
    if (!tiempoInicioPeticion) return "0ms";
    var diff = Date.now() - tiempoInicioPeticion;
    return diff + "ms";
}

/**
 * ============================================================================
 * CRITERIO 7: EJERCICIO AJAX 3 - ESTADOS DE LA PETICIÓN
 * Muestra en todo momento el estado en el que se encuentra la petición
 * en la zona '#estados'.
 * ============================================================================
 * También gestiona los Criterios 6, 8 y 9 al completarse la petición.
 */
function muestraEstado() {
    var estadosObj = document.getElementById('estados');
    if (!estadosObj || !peticion_http) return;

    var timestamp = obtenerMarcaTiempo();
    var delta = obtenerTiempoTranscurrido();
    var lineaEstado = "";

    switch (peticion_http.readyState) {
        case READY_STATE_UNINITIALIZED:
            lineaEstado = "[" + timestamp + " | +" + delta + "] Estado [0] No iniciada (UNSENT): Instancia creada, método open() aún no invocado.\n";
            break;

        case READY_STATE_LOADING:
            lineaEstado = "[" + timestamp + " | +" + delta + "] Estado [1] Cargando (OPENED): Conexión establecida con el servidor mediante open().\n";
            break;

        case READY_STATE_LOADED:
            lineaEstado = "[" + timestamp + " | +" + delta + "] Estado [2] Cabeceras recibidas (HEADERS_RECEIVED): Petición enviada mediante send(), cabeceras HTTP y código de estado disponibles.\n";
            break;

        case READY_STATE_INTERACTIVE:
            lineaEstado = "[" + timestamp + " | +" + delta + "] Estado [3] Interactiva (LOADING): Recibiendo datos del servidor (cuerpo parcial de la respuesta en descarga).\n";
            break;

        case READY_STATE_COMPLETE:
            lineaEstado = "[" + timestamp + " | +" + delta + "] Estado [4] Completada (DONE): Transferencia finalizada íntegramente. Todos los datos están disponibles.\n";
            
            // Cuando la petición ha finalizado completamente (readyState === 4):
            procesarRespuestaFinal();
            break;

        default:
            lineaEstado = "[" + timestamp + "] Estado desconocido: " + peticion_http.readyState + "\n";
            break;
    }

    // Agregar la línea al panel de estados conservando saltos de línea
    estadosObj.textContent += lineaEstado;
    // Auto-scroll al final para seguir la progresión en vivo
    estadosObj.scrollTop = estadosObj.scrollHeight;
}

/**
 * Procesa la respuesta una vez que readyState alcanza 4 (COMPLETE / DONE)
 * Cumple con los Criterios 6, 8 y 9.
 */
function procesarRespuestaFinal() {
    var codigoObj = document.getElementById('codigo');
    var cabecerasObj = document.getElementById('cabeceras');
    var contenidosObj = document.getElementById('contenidos');

    // ========================================================================
    // CRITERIO 9: EJERCICIO AJAX 5 - CÓDIGO Y TEXTO DE ESTADO
    // ========================================================================
    try {
        var statusNum = peticion_http.status;
        var statusTexto = peticion_http.statusText || "";
        
        // Explicación didáctica del código HTTP
        var explicacionStatus = "";
        if (statusNum >= 200 && statusNum < 300) {
            explicacionStatus = " (Éxito / Petición correcta)";
        } else if (statusNum >= 300 && statusNum < 400) {
            explicacionStatus = " (Redirección)";
        } else if (statusNum >= 400 && statusNum < 500) {
            explicacionStatus = " (Error del Cliente - Recurso no encontrado o no autorizado)";
        } else if (statusNum >= 500) {
            explicacionStatus = " (Error interno del Servidor)";
        } else if (statusNum === 0) {
            explicacionStatus = " (0 / Posible restricción de CORS o protocolo local file://)";
        }

        if (codigoObj) {
            codigoObj.textContent = statusNum + " " + statusTexto + explicacionStatus;
            
            // Destacar visualmente según el código
            codigoObj.className = "zona-datos " + (statusNum === 200 ? "status-ok" : (statusNum === 0 ? "status-cors" : "status-error"));
        }
    } catch (e) {
        if (codigoObj) codigoObj.textContent = "Error al leer el código de estado: " + e.message;
    }

    // ========================================================================
    // CRITERIO 8: EJERCICIO AJAX 4 - CABECERAS HTTP DE LA RESPUESTA
    // ========================================================================
    try {
        var cabeceras = peticion_http.getAllResponseHeaders();
        if (cabecerasObj) {
            if (cabeceras && cabeceras.trim().length > 0) {
                cabecerasObj.textContent = cabeceras;
            } else {
                cabecerasObj.textContent = "(No se recibieron cabeceras HTTP o fueron filtradas por la política de seguridad/CORS del navegador)";
            }
        }
    } catch (e) {
        if (cabecerasObj) cabecerasObj.textContent = "Error al acceder a las cabeceras HTTP: " + e.message;
    }

    // ========================================================================
    // CRITERIO 6: EJERCICIO AJAX 2 - CONTENIDO DEL ARCHIVO RECIBIDO
    // ========================================================================
    try {
        var contenido = peticion_http.responseText;
        if (contenidosObj) {
            if (contenido !== null && contenido !== undefined) {
                // Se utiliza textContent para mostrar el contenido fiel sin que el navegador
                // ejecute involuntariamente scripts o rompa la maquetación HTML
                contenidosObj.textContent = contenido;
            } else {
                contenidosObj.textContent = "(Respuesta vacía recibida del servidor)";
            }
        }
    } catch (e) {
        if (contenidosObj) {
            contenidosObj.textContent = "Error al obtener el contenido (responseText): " + e.message;
        }
    }

    // Reactivar el botón de enviar
    var btnEnviar = document.getElementById('enviar');
    if (btnEnviar) {
        btnEnviar.disabled = false;
        btnEnviar.innerHTML = 'Mostrar Contenidos';
    }
}

/**
 * ============================================================================
 * CRITERIO 6: EJERCICIO AJAX 2 - DESCARGA MEDIANTE PETICIÓN AJAX
 * Se activa al hacer clic en el botón '#enviar' ("Mostrar Contenidos").
 * ============================================================================
 */
function descargaArchivo() {
    var recursoInput = document.getElementById('recurso');
    var recursoUrl = recursoInput ? recursoInput.value.trim() : '';

    if (!recursoUrl) {
        alert("Por favor, introduce una URL o nombre de recurso válido.");
        return;
    }

    // Limpiar zonas de resultados previas
    var estadosObj = document.getElementById('estados');
    var codigoObj = document.getElementById('codigo');
    var cabecerasObj = document.getElementById('cabeceras');
    var contenidosObj = document.getElementById('contenidos');
    var btnEnviar = document.getElementById('enviar');

    if (estadosObj) estadosObj.textContent = "";
    if (codigoObj) {
        codigoObj.textContent = "Esperando respuesta...";
        codigoObj.className = "zona-datos";
    }
    if (cabecerasObj) cabecerasObj.textContent = "Esperando cabeceras...";
    if (contenidosObj) contenidosObj.textContent = "Descargando contenidos desde: " + recursoUrl + " ...";

    if (btnEnviar) {
        btnEnviar.disabled = true;
        btnEnviar.innerHTML = '<span class="spinner"></span> Descargando...';
    }

    // Instanciar el objeto XMLHttpRequest
    peticion_http = inicializa_xhr();

    if (!peticion_http) {
        alert("Tu navegador no soporta el objeto XMLHttpRequest para realizar peticiones AJAX.");
        if (btnEnviar) {
            btnEnviar.disabled = false;
            btnEnviar.innerHTML = 'Mostrar Contenidos';
        }
        return;
    }

    tiempoInicioPeticion = Date.now();

    // Registrar estado inicial 0: No iniciada
    if (estadosObj) {
        var t0 = obtenerMarcaTiempo();
        estadosObj.textContent = "[" + t0 + " | +0ms] Estado [0] No iniciada (UNSENT): Objeto XMLHttpRequest instanciado.\n";
    }

    // Asignar el manejador onreadystatechange para capturar todos los cambios de estado (Criterio 7)
    peticion_http.onreadystatechange = muestraEstado;

    // Manejo de posibles errores de red o CORS
    peticion_http.onerror = function(err) {
        var delta = obtenerTiempoTranscurrido();
        if (estadosObj) {
            estadosObj.textContent += "[" + obtenerMarcaTiempo() + " | +" + delta + "] [ERROR] La petición falló debido a un error de red o bloqueo de seguridad (CORS / Same-Origin Policy).\n";
        }
        if (codigoObj) {
            codigoObj.textContent = "0 Error de Red / CORS Blocked";
            codigoObj.className = "zona-datos status-cors";
        }
        if (cabecerasObj) {
            cabecerasObj.textContent = "(Cabeceras bloqueadas por política de seguridad del navegador)";
        }
        if (contenidosObj) {
            contenidosObj.textContent = 
                "AVISO DE SEGURIDAD / CORS:\n\n" +
                "La petición no pudo completarse. Esto ocurre habitualmente por:\n" +
                "1. Protocolo file://: Si abriste el archivo directamente haciendo doble clic (file:///...),\n" +
                "   los navegadores modernos restringen XMLHttpRequest a archivos locales.\n" +
                "   -> Solución: Inicia el servidor local incluido ejecutando: python serve.py\n" +
                "      y abre http://localhost:8000 en tu navegador.\n\n" +
                "2. Bloqueo CORS en URLs externas: El servidor remoto no incluye la cabecera 'Access-Control-Allow-Origin'.\n" +
                "   -> Puedes probar con recursos locales como 'datos.txt', 'datos.json' o 'index.html'.";
        }
        if (btnEnviar) {
            btnEnviar.disabled = false;
            btnEnviar.innerHTML = 'Mostrar Contenidos';
        }
    };

    // Configurar y enviar la petición asíncrona GET
    try {
        peticion_http.open('GET', recursoUrl, true);
        peticion_http.send(null);
    } catch (e) {
        if (estadosObj) {
            estadosObj.textContent += "[ERROR de ejecución] " + e.message + "\n";
        }
        if (contenidosObj) {
            contenidosObj.textContent = "Excepción capturada al ejecutar open()/send():\n" + e.message;
        }
        if (btnEnviar) {
            btnEnviar.disabled = false;
            btnEnviar.innerHTML = 'Mostrar Contenidos';
        }
    }
}

/**
 * Permite cambiar rápidamente la URL en el input para pruebas convenientes
 * @param {string} url 
 */
function fijarUrlPrueba(url) {
    var recursoInput = document.getElementById('recurso');
    if (recursoInput) {
        recursoInput.value = url;
        descargaArchivo();
    }
}

/**
 * ============================================================================
 * CRITERIO 5: EJERCICIO AJAX 1 - URL POR DEFECTO AL CARGAR LA PÁGINA
 * Al cargar la página, el cuadro de texto debe mostrar por defecto la URL
 * de la propia página (window.location.href).
 * ============================================================================
 */
function inicializarLaboratorioAJAX() {
    var recursoInput = document.getElementById('recurso');
    var btnEnviar = document.getElementById('enviar');

    // Asignar por defecto la URL de la propia página (Criterio 5)
    if (recursoInput) {
        recursoInput.value = window.location.href;
    }

    // Asociar el evento click al botón 'Mostrar Contenidos' (Criterio 6)
    if (btnEnviar) {
        btnEnviar.onclick = function() {
            descargaArchivo();
        };
    }

    // Permitir enviar con tecla ENTER dentro del cuadro de texto
    if (recursoInput) {
        recursoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                descargaArchivo();
            }
        });
    }

    // Mostrar mensaje inicial informativo en las zonas
    var estadosObj = document.getElementById('estados');
    var contenidosObj = document.getElementById('contenidos');
    var cabecerasObj = document.getElementById('cabeceras');
    var codigoObj = document.getElementById('codigo');

    if (estadosObj && !estadosObj.textContent.trim()) {
        estadosObj.textContent = "Sin peticiones activas. Haz clic en 'Mostrar Contenidos' para iniciar una petición AJAX.";
    }
    if (contenidosObj && !contenidosObj.textContent.trim()) {
        contenidosObj.textContent = "Aquí se mostrará el contenido del archivo descargado.";
    }
    if (cabecerasObj && !cabecerasObj.textContent.trim()) {
        cabecerasObj.textContent = "Aquí se mostrarán las cabeceras HTTP de respuesta del servidor.";
    }
    if (codigoObj && !codigoObj.textContent.trim()) {
        codigoObj.textContent = "Esperando petición...";
    }
}

// Ejecutar al completar la carga del documento HTML
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarLaboratorioAJAX);
} else {
    inicializarLaboratorioAJAX();
}
