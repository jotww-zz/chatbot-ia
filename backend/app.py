
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import os

app = Flask(__name__)
CORS(app)

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

@app.route("/")
def home():
    return jsonify({
        "projeto": "Nexus AI",
        "status": "online",
        "mensagem": "Backend funcionando!"
    })

@app.route("/chat", methods=["POST"])
def chat():
    dados = request.get_json()

    mensagem = dados.get("message", "")

    if not mensagem.strip():
        return jsonify({"erro": "Mensagem vazia"}), 400

    resposta = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": "Você é o Nexus AI, um assistente virtual inteligente, educado e prestativo. Responda em português."
            },
            {
                "role": "user",
                "content": mensagem
            }
        ]
    )

    return jsonify({
        "resposta": resposta.choices[0].message.content
    })

if __name__ == "__main__":
    app.run()
