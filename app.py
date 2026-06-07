import os
from flask import Flask, Response, render_template, request
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# 1. INITIALISATION GLOBALE : On crée le modèle UNE SEULE FOIS au démarrage
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-3.5-flash')  # Utilisation d'un modèle stable


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/prompt', methods=['POST'])
def prompt():
    data = request.get_json()
    user_input = data.get('message', [])  # On attend juste le dernier message

    if not user_input:
        return "Erreur : données manquantes", 400

    # On utilise le streaming directement
    return Response(event_stream(user_input), mimetype='text/plain')


def event_stream(user_input):
    try:
        # 2. APPEL DIRECT : On envoie juste le texte.
        # Si vous n'avez pas besoin de gérer un historique complexe pour le moment,
        # cette méthode est la plus légère en mémoire.
        response = model.generate_content(user_input, stream=True)

        for chunk in response:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        yield f"\n[Erreur serveur : {str(e)}]"


if __name__ == '__main__':
    app.run()