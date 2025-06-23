'''
Defines URL mappings for lambda_dev_server
Each key-value pair follows the pattern of

<endpoint>: {
    <protocol>: <lambda name>
}

'''
URL_MAPPINGS={
    "hint": {
        "GET": "getHint"
    },
    "set-match": {
        "PUT": "setMatch"
    },
    "upload-hints": {
        "POST": "uploadHints"
    },
    "results": {
        "GET": "getResults"
    },
    #     "clear": {
    #     "GET": "clearHintsTable"
    # }
}

SERVER_PORT=8001

TIMEOUT_IN_SECONDS=1000000
