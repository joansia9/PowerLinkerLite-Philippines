from decimal import Decimal
import csv, io, boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime, timezone
import os
from DynamoUtils import DynamoUtils

def getResults(event: dict, context: dict) -> dict | str:
    """A script to retrieve completed hints then store those hints in an S3 bucket.

    Args:
        event (dict): the event from the API Gateway request to Lambda
        context (dict): the context of the Lambda function

    Returns:
        dict or str: hints from the final page of the query loop (dict)
                        or an error message (str)
    """
    deploymentBranch = os.environ['DEPLOYMENT_BRANCH']

    s3Client = boto3.client('s3')
    s3Bucket = f'powerlinkerlite-{deploymentBranch}-bucket'
    dynamodb = boto3.resource('dynamodb', region_name='us-west-2')
    table = dynamodb.Table('powerlinkerlite')

    score = 2
    operationStart = datetime.now(tz=timezone.utc).timestamp() * 1000

    def getCompletedHints(startKey: int = None, limit: int = 3000) -> tuple[dict, dict | bool]:
        """Gets a batch of completed hints from the database and updates the exportedTime attribute.

        Args:
            startKey (int, optional): the key of the last item in the previous batch; defaults to None
            limit (int, optional): the maximum items to retrieve in a single batch; defaults to 3000

        Returns:
            tuple[dict, dict | bool]: a tuple containing a dictionary of the completed hints and either a dictionary of the last retrieved hint or the boolean False if there are no more hints to retrieve
        """
        gsiName = 'score-exported-index'

        keyConditionExpression = Key('score').eq(score) & Key('exported').eq(False)
        queryResponse = DynamoUtils.queryGSI(table, gsiName, keyConditionExpression, limit, startKey)
    
        items = queryResponse['Items']

        for item in items:
            # Update each item in the batch
            table.update_item(
                Key={
                    'url': item['url'],
                },
                UpdateExpression='SET exported = :exported, exportedTime = :exportedTime',
                ExpressionAttributeValues={
                    ':exported': True,
                    ':exportedTime': Decimal(operationStart)
                }
            )

        lastKey = queryResponse['LastEvaluatedKey'] if 'LastEvaluatedKey' in queryResponse else False
        return items, lastKey
    
    try:
        allItems = []
        
        items, lastKey = getCompletedHints()
        allItems += items

        while(lastKey):        
            items, lastKey = getCompletedHints(lastKey)
            allItems += items


        keys = set().union(*allItems)
        
        csvString = io.StringIO()
        dictWriter = csv.DictWriter(csvString, keys, quoting=csv.QUOTE_ALL)
        dictWriter.writeheader()
        dictWriter.writerows(allItems)

        s3Path= 'completed-hints/Completed Hints ' + datetime.now(tz=timezone.utc).strftime('%d-%m-%Y %H-%M-%S-%p') + '.csv'
        print(csvString.getvalue())

        s3Client.put_object(Bucket=s3Bucket, Key=s3Path, Body=csvString.getvalue())

        #returns non-edited version
        return items

    except Exception as e:
        return f'An error occurred: {str(e)}'
