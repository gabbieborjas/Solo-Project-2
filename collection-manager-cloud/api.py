from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
# This allows your Netlify site to talk to your Render server
CORS(app)

DATA_FILE = 'data.json'

def read_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def write_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/workouts', methods=['GET'])
def get_workouts():
    return jsonify(read_data())

@app.route('/workouts', methods=['POST'])
def add_workout():
    data = read_data()
    new_item = request.json
    # Validation
    if not new_item.get('name'):
        return jsonify({"error": "Name is required"}), 400
    
    new_item['id'] = int(os.urandom(4).hex(), 16)
    data.append(new_item)
    write_data(data)
    return jsonify(new_item), 201

@app.route('/workouts/<int:item_id>', methods=['DELETE'])
def delete_workout(item_id):
    data = read_data()
    data = [i for i in data if i['id'] != item_id]
    write_data(data)
    return jsonify({"success": True})

@app.route('/workouts/<int:item_id>', methods=['PUT'])
def update_workout(item_id):
    data = read_data()
    updated_info = request.json
    for item in data:
        if item['id'] == item_id:
            item.update(updated_info)
    write_data(data)
    return jsonify({"success": True})

if __name__ == '__main__':
    # Render uses the PORT environment variable
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
