from Validator import Validator
from setMatch import setMatch
from getHint import getHint
from getResults import getResults
from uploadHints import uploadHints

SUBDOMAIN = 'powerlinkerlite'

validator = Validator(SUBDOMAIN)

def handle_getHint(event: dict, context: dict) -> dict:
    """Runs the getHint Lambda function with proper origin validation and response headers.
    
    Args:
        event (dict): the event from the API Gateway request to Lambda
        context (dict): the context of the Lambda function
    
    Returns:
        dict: the response with CORS headers
    """

    results = validator.validate(event)
    return validator.sendCorsResponse(getHint(event, context), results['origin'])

def handle_setMatch(event: dict, context: dict) -> dict:
    """Runs the setMatch Lambda function with proper origin validation and response headers.
    
    Args:
        event (dict): the event from the API Gateway request to Lambda
        context (dict): the context of the Lambda function
    
    Returns:
        dict: the response with CORS headers
    """

    results = validator.validate(event)
    return validator.sendCorsResponse(setMatch(event, context), results['origin'])

def handle_uploadHints(event: dict, context: dict) -> dict:
    """Runs the uploadHints Lambda function with proper origin validation and response headers.
    
    Args:
        event (dict): the event from the API Gateway request to Lambda
        context (dict): the context of the Lambda function
    
    Returns:
        dict: the response with CORS headers
    """

    results = validator.validate(event)
    return validator.sendCorsResponse(uploadHints(event, context), results['origin'])

def handle_getResults(event: dict, context: dict) -> dict:
    """Runs the getHint Lambda function with proper origin validation and response headers.
    
    Args:
        event (dict): the event from the API Gateway request to Lambda
        context (dict): the context of the Lambda function
    
    Returns:
        dict: the response with CORS headers
    """

    results = validator.validate(event)
    return validator.sendCorsResponse(getResults(event, context), results['origin'])
