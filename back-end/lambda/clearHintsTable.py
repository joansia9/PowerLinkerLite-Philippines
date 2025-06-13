import boto3

def clearHintsTable(event: dict, context: dict) -> dict:
    """Delete all items in the Power Linker Lite table.

    Args:
        event (dict): the event from the API Gateway request to Lambda
        context (dict): the context of the Lambda function

    Returns:
        dict: a success message
    """
    # Create a DynamoDB client
    dynamodb = boto3.resource('dynamodb')

    # Specify the name of the table you want to delete all rows from
    tableName = 'powerlinkerlite'

    # Get a reference to the table
    table = dynamodb.Table(tableName)

    # Scan the table and delete each item
    response = table.scan()

    with table.batch_writer() as batch:
        while 'Items' in response:
            # Delete each item in the batch
            for item in response['Items']:
                batch.delete_item(Key={"url":item["url"]})

            # If there are more items to retrieve, continue scanning
            if 'LastEvaluatedKey' in response:
                response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'] if "LastEvaluatedKey" in response else False)
            else:
                break

    return {
        'statusCode': 200,
        'body': 'All rows deleted from the table.'
    }