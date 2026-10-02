import http.server
import os
import urllib.parse
import sys

DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def send_head(self):
        parsed = urllib.parse.urlsplit(self.path)
        path = parsed.path
        query = ('?' + parsed.query) if parsed.query else ''

        # 1. 301 Redirect /index.html -> /
        if path == '/index.html':
            self.send_response(301)
            self.send_header('Location', '/' + query)
            self.end_headers()
            return None

        # 2. 301 Redirect /page.html -> /page
        if path.endswith('.html'):
            clean_path = path[:-5]
            self.send_response(301)
            self.send_header('Location', clean_path + query)
            self.end_headers()
            return None

        return super().send_head()

    def translate_path(self, path):
        translated = super().translate_path(path)
        if not os.path.exists(translated):
            if os.path.isfile(translated + '.html'):
                return translated + '.html'
        return translated

    def guess_type(self, path):
        translated = self.translate_path(path)
        if translated.endswith('.html'):
            return 'text/html; charset=utf-8'
        return super().guess_type(path)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    port = 8080
    http.server.test(HandlerClass=CleanURLHandler, port=port)
