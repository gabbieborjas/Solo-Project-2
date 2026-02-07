import json
import os

# Robust path to find data.json in the project root
DATA_FILE = os.path.join(os.path.dirname(__file__), '../../data.json')

def handler(event, context):
    method = event.get('httpMethod')
    params = event.get('queryStringParameters') or {}
    item_id = params.get('id')

    # Load Data
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
    else:
        data = []

    # GET REQUEST
    if method == 'GET':
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps(data)
        }

    # POST REQUEST (Create)
    if method == 'POST':
        new_item = json.loads(event.get('body'))
        new_item['id'] = int(os.urandom(4).hex(), 16)
        data.append(new_item)
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=4)
        return {'statusCode': 201, 'body': json.dumps(new_item)}

    # PUT REQUEST (Update)
    if method == 'PUT':
        updated_info = json.loads(event.get('body'))
        for item in data:
            if str(item['id']) == str(item_id):
                item.update(updated_info)
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=4)
        return {'statusCode': 200, 'body': json.dumps(updated_info)}

    # DELETE REQUEST
    if method == 'DELETE':
        data = [i for i in data if str(i['id']) != str(item_id)]
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=4)
        return {'statusCode': 200, 'body': json.dumps({"success": True})}

    return {'statusCode': 405, 'body': 'Method Not Allowed'}
