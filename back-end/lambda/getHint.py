from decimal import Decimal
import boto3
from boto3.dynamodb.conditions import Attr, Key
from datetime import datetime, timezone
import random
from DynamoUtils import DynamoUtils

VIEW_LOCK_EXPIRATION_MILLIS = 2 * 60 * 60 * 1000
LOCKS_BEFORE_THIS_ARE_EXPIRED=Decimal(datetime.now(tz=timezone.utc).timestamp()*1000 - VIEW_LOCK_EXPIRATION_MILLIS)

def getHint(event: dict, context: dict) -> dict | str:
    """Lambda function that gets the next available hint based on number of votes (score)
        and upload time from the PowerLinkerLite DynamoDB table.

    Args:
        event (dict): the event from the API Gateway request to Lambda
        context (dict): the context of the Lambda function

    Returns:
        dict or str: a semi-random item that meets or is closest to meeting the priority criteria (dict)
                        or an error message (str)
    """
    tableName = 'powerlinkerlite'
    gsiName = 'score-uploadTime-index'
    score = 1
    limit = 3000
    filterExpression = (Attr('exportedTime').not_exists()
                        & (Attr('lastViewed').not_exists()
                        | Attr('lastViewed').lt(LOCKS_BEFORE_THIS_ARE_EXPIRED)))

    dynamodb = boto3.resource('dynamodb', region_name="us-west-2")
    table = dynamodb.Table(tableName)

    try:
        startKey = None
        randomItem = None
        while score >= 0:
            keyConditionExpression = Key('score').eq(score)
            response = DynamoUtils.queryGSI(table, gsiName, keyConditionExpression, limit, startKey, filterExpression)
            items = response.get('Items', [])
            if len(items) > 0:
                randomItem = random.choice(items)
                break
            # Go through all items in the partition
            startKey = response.get('LastEvaluatedKey')
            if startKey:
                continue
            score -= 1

        if randomItem:
            updateLastViewed(table, randomItem['url'])
            if float(randomItem['score']) % 1 == 0:
                randomItem['score'] = int(randomItem['score'])
            if float(randomItem['uploadTime']) % 1 == 0:
                randomItem['uploadTime'] = int(randomItem['uploadTime'])
            return randomItem
        
    except Exception as e:
        return f'An error occured: {str(e)}'

    return 'No hints available.'

def updateLastViewed(table: "boto3.client.DynamoDB.Table", url: str) -> None:
    """Updates a 'lastViewed' attribute in a DynamoDB table.

    Args:
        table (Table): a DynamoDB table
        url (dict): the partition key of the item to update
    """
    response = table.update_item(
        Key={
            'url': url,
        },
        UpdateExpression='SET lastViewed = :lastViewed',
        ExpressionAttributeValues={
            ':lastViewed': Decimal(datetime.now(tz=timezone.utc).timestamp()*1000)
        }
    )
