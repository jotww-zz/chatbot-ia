
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatArea = document.getElementById("chatArea");
const welcome = document.getElementById("welcome");
const sendButton = document.getElementById("sendButton");

// Endereço do nosso Backend
const API_URL = "https://chatbot-ia-s7f6.onrender.com/chat";

// Adiciona uma mensagem na conversa
function addMessage(text, sender) {
    const message = document.createElement("div");

    message.classList.add("message");
    message.classList.add(
        sender === "user" ? "user-message" : "ai-message"
    );

    message.textContent = text;
    chatArea.appendChild(message);

    chatArea.scrollTop = chatArea.scrollHeight;
}

// Envia a mensagem para a inteligência artificial
async function sendMessage(text) {
    if (!text.trim()) return;

    welcome.style.display = "none";

    addMessage(text, "user");

    userInput.value = "";
    userInput.disabled = true;
    sendButton.disabled = true;

    const loading = document.createElement("div");
    loading.classList.add("message", "ai-message");
    loading.textContent = "Nexus está pensando...";
    chatArea.appendChild(loading);

    try {
        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: text
            })
        });

        const data = await response.json();

        loading.remove();

        if (!response.ok) {
            throw new Error(data.erro || "Erro ao processar mensagem.");
        }

        addMessage(data.resposta, "ai");

    } catch (error) {
        loading.remove();

        addMessage(
            "Não consegui conectar ao servidor. Tente novamente.",
            "ai"
        );

        console.error(error);

    } finally {
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }
}

// Evento de envio do formulário
chatForm.addEventListener("submit", function(event) {
    event.preventDefault();

    sendMessage(userInput.value);
});

// Sugestões de perguntas
document.querySelectorAll(".suggestion").forEach(button => {
    button.addEventListener("click", function() {
        sendMessage(this.textContent);
    });
});
