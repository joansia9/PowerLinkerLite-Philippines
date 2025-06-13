import boto3

class DynamoUtils:
    """A utils class providing shared DynamoDB data access functions."""
    
    @staticmethod
    def queryGSI(table: "boto3.client.DynamoDB.Table", gsiName: str, keyConditionExpression: str,
                limit: int, startKey: dict | None, filterExpression: str | None = None) -> dict:
        """A DynamoDB utils function to perform the correct gsi query based on the given parameters.

        Args:
            table (Table): a DynamoDB table
            gsiName (str): the name of the GSI
            keyConditionExpression (str): the partition key to query the GSI with
            filterExpression (str or None): a logical expression that will evaluate 'True' for all returned items
            limit (int): the maximum number of items a single query will return
            startKey (dict or None): the next first item the query will evaluate

        Returns:
            dict: the response from DynamoDB
        """

        if filterExpression is None:
            response = DynamoUtils._queryGSIWithoutFilter(table, gsiName, keyConditionExpression, limit, startKey)
        else:
            response = DynamoUtils._queryGSIWithFilter(table, gsiName, keyConditionExpression, limit, startKey, filterExpression)

        return response

    @staticmethod
    def _queryGSIWithFilter(table: "boto3.client.DynamoDB.Table", gsiName: str, keyConditionExpression: str,
                limit: int, startKey: dict | None, filterExpression: str | None) -> dict:
        """A helper function to perform a gsi query with a filter expression.

        Args:
            table (Table): a DynamoDB table
            gsiName (str): the name of the GSI
            keyConditionExpression (str): the partition key to query the GSI with
            filterExpression (str): a logical expression that will evaluate 'True' for all returned items
            limit (int): the maximum number of items a single query will return
            startKey (dict or None): the next first item the query will evaluate

        Returns:
            dict: the response from DynamoDB
        """
        if startKey == None:
            response = table.query(
                IndexName=gsiName,
                KeyConditionExpression=keyConditionExpression,
                FilterExpression=filterExpression,
                Limit=limit
            )
        else:
            response = table.query(
                IndexName=gsiName,
                KeyConditionExpression=keyConditionExpression,
                FilterExpression=filterExpression,
                Limit=limit,
                ExclusiveStartKey=startKey
            )
        return response

    @staticmethod
    def _queryGSIWithoutFilter(table: "boto3.client.DynamoDB.Table", gsiName: str,
                            keyConditionExpression: str, limit: int, startKey: dict | None) -> dict:
        """A helper function to perform a gsi query without a filter expression.

        Args:
            table (Table): a DynamoDB table
            gsiName (str): the name of the GSI
            keyConditionExpression (str): the partition key to query the GSI with
            limit (int): the maximum number of items a single query will return
            startKey (dict or None): the next first item the query will evaluate

        Returns:
            dict: the response from DynamoDB
        """
        if startKey == None:
                response = table.query(
                    IndexName=gsiName,
                    KeyConditionExpression=keyConditionExpression,
                    Limit=limit
                )
        else:
            response = table.query(
                IndexName=gsiName,
                KeyConditionExpression=keyConditionExpression,
                Limit=limit,
                ExclusiveStartKey=startKey
            )
        return response
