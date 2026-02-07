import json
import os

# This looks for data.json in the root folder of your project
DATA_FILE = os.path.join(os.path.dirname(__file__), '../../data.json')

def handler(event, context):
    # If the file is missing for some reason, create a default list
    if not os.path.exists(DATA_FILE):
        return {'statusCode': 200, 'body': json.dumps([])}

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)
    
    # ... rest of your handler logic ...
    return {'statusCode': 200, 'body': json.dumps(data)}
