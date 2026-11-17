"""
Servidor HTTP local simple con soporte de CORS para ejecutar el Laboratorio de JS y AJAX.
Uso:
    python serve.py
    o: python -m http.server 8000
Luego abrir en el navegador: http://localhost:8000/
"""
import http.server
import socketserver
import webbrowser

PORT = 8000

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    handler = CORSRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        url = f"http://localhost:{PORT}/"
        print(f"==================================================")
        print(f" Servidor de Laboratorio iniciado exitosamente")
        print(f" URL: {url}")
        print(f" Presiona Ctrl + C para detener el servidor")
        print(f"==================================================")
        try:
            webbrowser.open(url)
        except Exception:
            pass
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido.")
