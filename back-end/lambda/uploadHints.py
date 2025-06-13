import boto3
import json
import os
from datetime import datetime, timezone
import pandas as pd

from dotenv import load_dotenv
load_dotenv('.env')

UPLOAD_DIRECTORY = "pending-uploads"
UPLOADED_DIRECTORY = "previous-uploads"

def uploadHints(event: dict, context: dict) -> str:
    """A script to add required attributes to hint data from S3 then upload it to DynamoDB.

    Args:
        event (dict): the event from the API Gateway request to Lambda
        context (dict): the context of the Lambda function

    Returns:
        str: a success or error message
    """
    deploymentBranch = os.environ['DEPLOYMENT_BRANCH']

    body = event['body']
    body = json.loads(body)

    s3Uri = body['csvUri']
    
    print("BUCKET NAME:")
    print(f'powerlinkerlite-{deploymentBranch}-bucket')

    print("S3 URI:")
    print(s3Uri)

    s3Bucket = f'powerlinkerlite-{deploymentBranch}-bucket'

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('powerlinkerlite')

    try:
        # Get the CSV file from S3
        s3Client = boto3.client('s3')
        response = s3Client.get_object(Bucket=s3Bucket, Key=UPLOAD_DIRECTORY + "/" + s3Uri)

        # Parse the CSV file
        df = pd.read_csv(response['Body'])

        # Add fields
        batchID = s3Uri.split('/')[-1].split('.')[0]
        uploadTime = int(datetime.now(tz=timezone.utc).timestamp() * 1000)

        df['url'] = 'https://www.familysearch.org/search/linker?pal=/ark:/61903/1:1:' + df['ark'] + '&id=' + df['pid']
        df['batchID'] = batchID
        df['score'] = 0
        df['results'] = '[]'
        df['uploadTime'] = uploadTime
        df['exported'] = False

        # Write rows to Dynamo
        with table.batch_writer() as batch:
            df.apply(lambda item: uploadItem(item, batch), axis=1)
        
        # Copy the object to the new destination
        s3Client.copy_object(Bucket=s3Bucket, CopySource={'Bucket': s3Bucket, 'Key': UPLOAD_DIRECTORY + "/" + s3Uri}, Key=UPLOADED_DIRECTORY + "/" + s3Uri)
        
        # Delete the original object from the source directory
        s3Client.delete_object(Bucket=s3Bucket, Key=UPLOAD_DIRECTORY + "/" + s3Uri)

        return "CSV file uploaded successfully to DynamoDB."

    except Exception as e:
        return f"An error occurred: {str(e)}"
    
def uploadItem(item: pd.Series, batch: "boto3.client.DynamoDB.Table.BatchWriter") -> None:
    """A helper function that uploads the fields of a Series object as a single row to DynamoDb.

    Args:
        item (pd.Series): a Pandas Series containing a single row to upload
        batch (BatchWriter): a DynamoDB batchwriter
    """

    item = item.fillna('')
    item = item.to_dict()
    item['score'] = int(item['score'])
    item['uploadTime'] = int(item['uploadTime'])

    batch.put_item(Item=item)
