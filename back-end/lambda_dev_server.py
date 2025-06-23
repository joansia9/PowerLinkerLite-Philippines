import sys, os, importlib, json
from decimal import Decimal
from http.server import BaseHTTPRequestHandler, HTTPServer
from lambda_server_settings import URL_MAPPINGS, SERVER_PORT, TIMEOUT_IN_SECONDS

current = os.path.dirname(os.path.realpath(__file__))
sys.path.append(f'{current}/lambda')

class RequestHandler(BaseHTTPRequestHandler):
    """Handler for HTTP requests directed at the lambda development server."""
    
    #cors error responses
    def send_cors_headers(self):
        """Sends CORS headers for cross-origin requests."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Methods', '*')
    
    def send_error(self, code, message=None, explain=None):
        """Override send_error to include CORS headers."""
        self.send_response(code)
        self.send_cors_headers()
        self.send_header('Content-type', 'text/plain; charset=utf-8')
        self.end_headers()
        if message:
            self.wfile.write(message.encode('utf-8'))
    
    def do_GET(self) -> None:
        """Handles GET requests."""
        self.doAny("GET")
    
    def do_POST(self) -> None:
        """Handles POST requests."""
        self.doAny("POST")

    def do_PUT(self) -> None:
        """Handles PUT requests."""
        self.doAny("PUT")

    def do_DELETE(self) -> None:
        """Handles DELETE requests."""
        self.doAny("DELETE")
        
    def doAny(self, method: str) -> None:
        """Constructs event and context parameters and triggers the lambda function.

        Args:
            method (str): an uppercase string representation of the particular HTTP method

        Raises:
            TimeoutError: the lambda function ran for longer than TIMEOUT_IN_SECONDS 
        """
        path = self.path.split("?")[0].split("#")[0][1:]
        contentLength = self.headers['content-length']
        if contentLength is not None:
            contentLength = int(contentLength)
            body=json.loads(self.rfile.read(contentLength))
        else:
            contentLength = 0
            body={}

        try:
            # Add origin header for local development
            headers = dict(self.headers)
            headers['origin'] = 'http://localhost:3000'  # React default port
            
            event = {
                    "headers": headers,
                    "body": json.dumps(body)
                }
            context = {"timeout": TIMEOUT_IN_SECONDS}
            handler = self.getHandler(method, path)                
            result = handler(event, context)
            
            print("Handler executed successfully")
            result = self.replaceDecimalsWithFloatsInts(result)
            result = json.dumps(result).encode("utf-8")

            self.sendJsonResponse(json=result)
        
        except KeyError:
            self.send_error(404, "Endpoint not found")
        except TimeoutError:
            self.send_error(500, "Lambda function timed out")
        except Exception as e:
            print("Server Error:", e)
            self.send_error(500, "There was an error")
    
    def getHandler(self, protocol: str, path: str) -> "function":
        """A function to retrieve the requested lambda function.

        Args:
            protocol (str): the lambda's HTTP method
            path (str): the lambda's api endpoint

        Returns
            function: the lambda function to call
        """
        lambdaName = URL_MAPPINGS[path][protocol]
        lambdaModule = importlib.import_module("."+lambdaName, "lambda")
        lambdaHandler = getattr(lambdaModule,lambdaName)
        return lambdaHandler

    def sendJsonResponse(self, json: str, status: int = 200) -> None:
        """Sends json response to request origin.

        Args:
            json (str): a json string representation of the response object
            status (int, optional): the response status code; defaults to 200
        """
        self.send_response(status)
        self.send_cors_headers()
        self.send_header('Content-type', 'application/json')
        self.send_header("Content-Length", str(len(json)))
        self.end_headers()
        self.wfile.write(json)

    def do_OPTIONS(self) -> None:
        """Handles OPTIONS requests."""
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def replaceDecimalsWithFloatsInts(self, obj: object) -> object:
        """Recursively replaces Decimal types favored by AWS services with float and int types.

        Works only for dict, list, and Decimal types. Returns all other types without change.

        Args:
            obj (any): generally a list, dictionary, or number suspected of being/containing the Decimal type

        Returns:
            any: obj with all Decimal types converted to int or float types
        """
        if isinstance(obj, list):
            for i in range(len(obj)):
                obj[i] = self.replaceDecimalsWithFloatsInts(obj[i])
            return obj
        elif isinstance(obj, dict):
            for k in obj.keys():
                obj[k] = self.replaceDecimalsWithFloatsInts(obj[k])
            return obj
        elif isinstance(obj, Decimal):
            if obj % 1 == 0:
                return int(obj)
            else:
                return float(obj)
        else:
            return obj


def run(serverClass: HTTPServer = HTTPServer, handlerClass: BaseHTTPRequestHandler = RequestHandler, port: int = 8000) -> None:
    """Begins the lambda development server.

    Args:
        serverClass (HTTPServer, optional): the class of the HTTP server; defaults to HTTPServer
        handlerClass (BaseHTTPRequestHandler, optional): handler class that inherits from BaseHTTPRequestHandler; defaults to RequestHandler
        port (int, optional): the port to host the server on; defaults to 8000
    """
    serverAddress = ('', port)
    httpd = serverClass(serverAddress, handlerClass)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()


if __name__ == '__main__':
    """Entrypoint for the lambda development server."""
    run(port=SERVER_PORT)
