from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.route('/api/message')
def get_message():
    return jsonify({"message": "Hello from the Flask backend!"})

if __name__ == '__main__':
    app.run(debug=True)
