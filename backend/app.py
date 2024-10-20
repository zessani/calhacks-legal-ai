from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import google.generativeai as genai
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions
import re

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Configure the Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

# Initialize Chroma client with persistent storage
chroma_client = chromadb.PersistentClient(path="./chroma_db")
default_ef = embedding_functions.DefaultEmbeddingFunction()
collection = chroma_client.get_or_create_collection(name="legal_documents", embedding_function=default_ef)

# Regex pattern for sentence splitting
sentence_pattern = re.compile(r'(?<!\w\.\w.)(?![A-Z][a-z]\.)(?<=\.|\?|\!)\s')

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
    
    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        # Retrieve relevant chunks from Chroma
        results = collection.query(
            query_texts=[text],
            n_results=5
        )

        print(f"Query results: {results}")
        
        relevant_chunks = []
        formatted_chunks = ""
        for i, (doc, metadata, distance) in enumerate(zip(results['documents'][0], results['metadatas'][0], results['distances'][0])):
            chunk = {
                "text": doc,
                "metadata": metadata,
                "score": 1 - distance  # Convert distance to similarity score
            }
            relevant_chunks.append(chunk)
            formatted_chunks += f"<CHUNK {i+1}>\n{doc}\n</CHUNK {i+1}>\n\n"
        
        prompt = f"""You are a legal AI assistant. Provide a legal analysis for the following user input:

User Input: {text}

Relevant Document Chunks:
{formatted_chunks}

Include potential legal issues, relevant laws or regulations, and suggested next steps. Format the response clearly and cite specific parts of the document where relevant. If no relevant chunks are provided, base your analysis solely on the user input.

Your response should be structured as follows:
1. Summary of the situation
2. Potential legal issues identified
3. Relevant laws or regulations (with citations if applicable)
4. Analysis of how the law applies to the situation
5. Suggested next steps
6. Disclaimer

Please answer the User Input using the relevant document chunks to the best of your ability.
"""

        response = model.generate_content(prompt)
        llm_response = response.text
        
        # Extract citations from the response
        citations = []
        for chunk in relevant_chunks:
            if f"[{chunk['metadata']['source']}:{chunk['metadata']['chunk_id']}]" in llm_response:
                citations.append({
                    "docName": chunk['metadata']['source'],
                    "chunkId": chunk['metadata']['chunk_id'],
                    "text": chunk['text']
                })
        
        return jsonify({
            "response": llm_response,
            "citations": citations
        })
    except Exception as e:
        print(f"Error in llm_inference: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/chunk_document', methods=['POST'])
def chunk_document():
    data = request.json
    text = data.get('text')
    doc_name = data.get('name')
    
    if not text or not doc_name:
        return jsonify({"error": "No text or document name provided"}), 400

    try:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        chunks = text_splitter.split_text(text)
        
        print(f"Created {len(chunks)} chunks for document: {doc_name}")
        
        # Store chunks in Chroma
        ids = [f"{doc_name}_{i}" for i in range(len(chunks))]
        metadatas = [{"source": doc_name, "chunk_id": i} for i in range(len(chunks))]
        
        collection.add(
            documents=chunks,
            metadatas=metadatas,
            ids=ids
        )
        
        print(f"Stored {len(chunks)} chunks in Chroma for document: {doc_name}")
        
        # Verify that chunks were added
        added_chunks = collection.get(ids=ids)
        print(f"Retrieved {len(added_chunks['ids'])} chunks from Chroma for document: {doc_name}")
        
        return jsonify({"chunks": chunks, "doc_name": doc_name})
    except Exception as e:
        print(f"Error in chunk_document: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/clear_data', methods=['POST'])
def clear_data():
    try:
        # Get all document IDs
        all_ids = collection.get()['ids']
        
        # Delete all documents
        if all_ids:
            collection.delete(ids=all_ids)
        
        return jsonify({"message": "All data cleared successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/debug_chroma', methods=['GET'])
def debug_chroma():
    try:
        all_ids = collection.get()['ids']
        all_chunks = collection.get(ids=all_ids)
        return jsonify({
            "total_chunks": len(all_ids),
            "sample_chunks": all_chunks['documents'][:5] if all_chunks['documents'] else [],
            "sample_metadatas": all_chunks['metadatas'][:5] if all_chunks['metadatas'] else []
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/summarize_note', methods=['POST'])
def summarize_note():
    data = request.json
    note_content = data.get('note_content')
    
    if not note_content:
        return jsonify({"error": "No note content provided"}), 400

    try:
        prompt = f"""Summarize the following note in 2-3 words to create a concise title:

{note_content}

Title:"""

        response = model.generate_content(prompt)
        summary = response.text.strip()
        
        return jsonify({"summary": summary})
    except Exception as e:
        print(f"Error in summarize_note: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
