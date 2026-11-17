# Laboratorio: Tecnologías JavaScript y AJAX

## Cómo iniciar el proyecto

Para visualizar y probar la aplicación web, sigue estos pasos:

### Opción 1: Servidor Local (Recomendado)
Para que las peticiones asíncronas AJAX (`XMLHttpRequest`) funcionen sin restricciones de seguridad de archivos locales (`file://`), inicia el servidor HTTP local:

1. Abre una terminal en esta carpeta.
2. Ejecuta:
   ```bash
   python serve.py
   ```
   *(o alternativamente: `python -m http.server 8000`)*.
3. Abre tu navegador web e ingresa a:
   ```
   http://localhost:8000/
   ```

### Opción 2: Apertura directa en el navegador
Puedes abrir directamente el archivo `index.html` o `ajax_clasico.html` en cualquier navegador web haciendo doble clic sobre él.

---

### Archivos disponibles:
- `index.html`: Aplicación interactiva con las secciones de Laboratorio AJAX y Ejercicios JavaScript.
- `ajax_clasico.html`: Maquetación clásica independiente del ejercicio de estados AJAX.
