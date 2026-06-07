FlaskGPT : Interface de Chat avec Gemini AI
FlaskGPT est une application web interactive permettant de discuter en temps réel avec le modèle Gemini AI de Google. Ce projet utilise une architecture moderne basée sur Poetry pour la gestion stricte des dépendances, assurant ainsi un environnement de développement propre et reproductible.

 Stack Technique
Backend : Python 3, Flask, Gunicorn.

IA : API Google Generative AI (google-generativeai).

Gestion des dépendances : Poetry.

Configuration : python-dotenv.

Frontend : HTML5, JavaScript, Tailwind CSS.

 Installation & Workflow Poetry
Ce projet utilise Poetry pour gérer l'environnement virtuel et les bibliothèques.

Cloner le dépôt :

Bash
git clone <votre-url-github>
cd nom-du-projet
Installation des dépendances initiales :

Bash
poetry install
Ajout de bibliothèques (Workflow Poetry) :
Pour ajouter de nouvelles fonctionnalités, nous utilisons la commande poetry add qui met à jour automatiquement votre configuration :

Bash
# Ajout de la bibliothèque Google Gemini
poetry add google-generativeai

# Ajout de la gestion des variables d'environnement
poetry add python-dotenv

# Ajout de Flask
poetry add flask
Lancement de l'environnement :

Bash
poetry shell
Lancement local :

Bash
python app.py
 Déploiement sur Render
Pour déployer, Render utilise le fichier pyproject.toml généré par Poetry :

Configuration : Connectez votre dépôt GitHub.

Build Command : pip install poetry && poetry install

Start Command : poetry run gunicorn app:app

Environment Variables : N'oubliez pas d'ajouter votre GEMINI_API_KEY dans le tableau de bord Render.

Structure du projet
app.py : Logique serveur et intégration de l'API Gemini.

pyproject.toml : Fichier maître gérant toutes vos dépendances (Flask, Gemini, dotenv, etc.).

templates/index.html : Interface utilisateur avec Tailwind CSS.

static/js/script.js : Moteur asynchrone pour le streaming des messages.