import os
from typing import Generator
from flask import Flask, Response, render_template, request
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuration de la clé API Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


@app.route('/')
def home():
    return render_template('index.html')


# Dans app.py, assurez-vous que ceci est bien en place
@app.route('/prompt', methods=['POST'])
def prompt():
    data = request.get_json()
    if not data or 'message' not in data:
        return "Erreur : données manquantes", 400

    # 'message' contient la liste complète de l'historique
    messages = data['message']

    # On convertit cette liste en format que Gemini comprend
    # Note : Le dernier message est le nouveau prompt de l'utilisateur
    conversation = build_conversation_dict(messages=messages)

    # On envoie au générateur
    return Response(event_stream(conversation), mimetype='text/plain')

def event_stream(conversation: list[dict]) -> Generator[str, None, None]:
    model = genai.GenerativeModel('gemini-3.5-flash')

    # Conversion correcte
    history = []
    for msg in conversation:
        # On s'assure que le rôle est accepté par Gemini
        role = 'user' if msg['role'] == 'user' else 'model'
        history.append({"role": role, "parts": [msg['content']]})

    # Appel au streaming
    response = model.generate_content(history, stream=True)

    for chunk in response:
        if chunk.text:
            yield chunk.text

def build_conversation_dict(messages: list) -> list[dict]:
    return [
        {"role": "user" if i % 2 == 0 else "assistant", "content": message}
        for i, message in enumerate(messages)
    ]


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)