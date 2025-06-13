import json
import boto3
from datetime import datetime, timezone

def setMatch(event: dict, context: dict) -> str:
    """Lambda function that updates the score and results attributes in the PowerLinkerLite DynamoDB table.

    Args:
        event (dict): the event from the API Gateway request to Lambda
        context (dict): the context of the Lambda function

    Returns:
        str: a success or error message
    """
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('powerlinkerlite')

    body = event['body']
    body = json.loads(body)

    url = body['url']
    isMatch = body['isMatch']
    score = body['score']
    results = body['results']
    results = json.loads(results)

    score += 1
    timestamp = datetime.now(tz=timezone.utc).timestamp()*1000
    results.append([isMatch, int(timestamp)])

    try:
        response = table.update_item(
            Key={
                'url': url,
            },
            UpdateExpression='SET score = :score, results = :results',
            ExpressionAttributeValues={
                ':score': int(score),
                ':results': json.dumps(results)
            }
        )
        
        return "Match status updated successfully."
    
    except Exception as e:
        return f"An error occurred: {str(e)}"
