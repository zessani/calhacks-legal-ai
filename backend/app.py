from flask import Flask, jsonify, request
from flask_cors import CORS
import time
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Configure the Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

@app.route('/api/message')
def get_message():
    return jsonify({"message": "Hello from the Flask backend!"})

@app.route('/api/translate', methods=['POST'])
def translate_text():
    data = request.json
    text = data.get('text')
    target_language = data.get('target_language', 'en')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        prompt = f"Translate the following text to {target_language}:\n\n{text}"
        response = model.generate_content(prompt)
        translated_text = response.text
        return jsonify({"translated_text": translated_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/llm_inference', methods=['POST'])
def llm_inference():
    data = request.json
    text = data.get('text')
    document = data.get('document', '')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        prompt = f"""You are a legal AI assistant. Provide a legal analysis for the following user input:

User Input: {text}

Document Context:
{document}

Include potential legal issues, relevant laws or regulations, and suggested next steps. Format the response clearly and cite specific parts of the document where relevant. If the document is empty or not provided, base your analysis solely on the user input.

Your response should be structured as follows:
1. Summary of the situation
2. Potential legal issues identified
3. Relevant laws or regulations (with citations if applicable)
4. Analysis of how the law applies to the situation
5. Suggested next steps
6. Disclaimer

Please ensure all citations and references to the document are accurate and relevant."""

        response = model.generate_content(prompt)
        llm_response = response.text
        return jsonify({"response": llm_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
