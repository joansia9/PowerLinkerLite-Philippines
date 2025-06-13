import json
from DecimalEncoder import DecimalEncoder
from urllib.parse import urlparse

class Validator:

    """Validates that the request comes from an allowed origin.

    Attributes:
        DEV_DOMAIN (str): the domain for the development environment
        PRD_DOMAIN (str): the domain for the production environment
        allowedDomains (list): the allowed domains for the project
    """

    DEV_DOMAIN = "rll-dev.byu.edu"
    PRD_DOMAIN = "rll.byu.edu"
    allowedDomains = [DEV_DOMAIN, PRD_DOMAIN]

    def __init__(self, sub: str) -> None:
        """Initializes the Validator.

        Args:
            sub (str): the subdomain for the project
        """
        self.subdomain = sub

    def validate(self, event: dict) -> dict:
        """Validates that the request comes from an allowed origin.

        Args:
            event (dict): the event from the API Gateway request to Lambda

        Raises:
            Exception: the request did not come from an allowed domain

        Returns:
            dict: the origin and domain from the request headers
        """
        print('Event:', event)

        origin = self.getOrigin(event)
        domain = self.getDomain(origin)
        if (domain is None):
            raise Exception('Request does not come from an allowed domain:', origin)
        self.validateRequest(origin, domain)
        return {'origin': origin, 'domain': domain}
    
    def getOrigin(self, event: dict) -> str:
        """Gets the origin from the request headers.

        Args:
            event (dict): the event from the API Gateway request to Lambda

        Returns:
            str: the origin from the request headers
        """
        caseInsensitiveEvent = dict((key.lower(), event[key]) for key in event)
        headers = caseInsensitiveEvent['headers']
        
        caseInsensitiveHeaders = dict((key.lower(), headers[key]) for key in headers)
        origin = caseInsensitiveHeaders['origin']
        return origin
    
    def getDomain(self, origin: str) -> str:
        """Parses the origin to find the domain. 

        Args:
            origin (str): the origin from the request headers

        Returns:
            str: the domain from the origin
        """
        if (origin is None):
            print('No origin provided in request. Origin is None.')
            return None
        
        hostname = urlparse(origin).hostname

        if (hostname.endswith(self.DEV_DOMAIN)):
            return self.DEV_DOMAIN
        elif (hostname.endswith(self.PRD_DOMAIN)):
            return self.PRD_DOMAIN
        else:
            return None

    def validateRequest(self, origin: str, domain: str) -> bool:
        """Validates that the request comes from an allowed origin.

        Args:
            origin (str): the origin from the request headers
            domain (str): the domain from the origin

        Raises:
            Exception: the request does not come from an allowed origin

        Returns:
            bool: whether the request comes from an allowed origin
        """
        if not (origin == 'https://' + self.subdomain + '.' + domain):
            raise Exception('Request does not come from an allowed origin:', origin)
    
    def sendCorsResponse(self, response: dict, origin: str) -> dict:
        """Sends a response with CORS headers.

        Args:
            response (dict): the response from the Lambda function
            origin (str): the origin from the request headers

        Returns:
            dict: the response with CORS headers
        """
        responseMsg = {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': origin},
            'body': json.dumps(response, cls=DecimalEncoder)
        }
        print(responseMsg)
        return responseMsg
