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
        parsed = urllib.parse.urlsplit(path)
        clean_norm = parsed.path.strip('/').lower()
        
        # Route aliases for 360 virtual tours
        if clean_norm in ['360', 'tong-quan-360', 'tour-tong-quan', 'tong-quan', 'public/360newtowndanang', 'public/360newtowndanang/index.html']:
            return os.path.join(DIRECTORY, 'tong-quan-360.html')
        if clean_norm in ['canho3pn', 'can-ho-3pn', 'public/360newtowndanang/canho3pn', 'public/360newtowndanang/canho3pn/index.html']:
            return os.path.join(DIRECTORY, 'tour.html')
        if clean_norm in ['canho2pn', 'can-ho-2pn', 'tour-2pn', 'public/360newtowndanang/canho2pn', 'public/360newtowndanang/canho2pn/index.html']:
            return os.path.join(DIRECTORY, 'can-ho-2pn.html')

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
