function _cloneAnswerBlock() {
    const output = document.querySelector("#gpt-output");
    const template = document.querySelector('#chat-template');
    const clone = template.cloneNode(true);
    clone.id = "";
    output.appendChild(clone);
    clone.classList.remove("hidden");
    return clone.querySelector(".message");
}

function addToLog(message) {
    const infoBlock = _cloneAnswerBlock();
    if (!infoBlock) {
        console.error("Échec de la création du bloc d'information");
        return null;
    }
    infoBlock.innerText = message;
    return infoBlock;
}

// NOUVELLES FONCTIONS POUR L'HISTORIQUE 

function saveChatHistory(prompt, response) {
    let history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    history.push({ prompt, response, date: Date.now() });
    localStorage.setItem('chatHistory', JSON.stringify(history));
    renderHistoryList();
}

function renderHistoryList() {
    const historyList = document.querySelector("#history-list");
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    
    historyList.innerHTML = '';
    history.forEach((chat, index) => {
        const item = document.createElement("button");
        item.className = "w-full text-left p-2 text-xs text-gray-400 hover:bg-gray-800 rounded truncate";
        item.innerText = chat.prompt;
        item.onclick = () => alert("Chargement de : " + chat.prompt); // Logique de chargement à définir
        historyList.appendChild(item);
    });
}



async function fetchPromptResponse(prompt) {
    const response = await fetch("/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: [prompt] }),
    });
    return response.body.getReader();
}

async function readResponseChunks(reader, gptOutput) {
    const decoder = new TextDecoder();
    const converter = new showdown.Converter();
    let chunks = "";

    while (true) {
        const {done, value} = await reader.read();
        if (done) break;

        const decodedText = decoder.decode(value, {stream: true});
        chunks += decodedText;

        gptOutput.innerHTML = converter.makeHtml(chunks);
        gptOutput.scrollTop = gptOutput.scrollHeight;
    }
    return chunks; // Retourne le texte complet pour le sauvegarder
}

document.addEventListener("DOMContentLoaded", () => {
    renderHistoryList(); // Charger l'historique au démarrage

    const form = document.querySelector("#prompt-form");
    const spinnerIcon = document.querySelector("#spinner-icon");
    const sendIcon = document.querySelector("#send-icon");

    // Bouton nouvelle discussion
    document.querySelector("#new-chat-btn").addEventListener("click", () => {
        document.querySelector("#gpt-output").innerHTML = "";
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        spinnerIcon.classList.remove("hidden");
        sendIcon.classList.add("hidden");

        const prompt = form.elements.prompt.value;
        if (!prompt.trim()) return;

        addToLog(prompt);
        form.elements.prompt.value = ""; // Vider l'input

        try {
            const gptOutput = addToLog("JPT est en train de réfléchir...");
            const reader = await fetchPromptResponse(prompt);
            const fullResponse = await readResponseChunks(reader, gptOutput);
            
            // Sauvegarder dans l'historique
            saveChatHistory(prompt, fullResponse);

        } catch (error) {
            console.error('Une erreur est survenue:', error);
        } finally {
            spinnerIcon.classList.add("hidden");
            sendIcon.classList.remove("hidden");
            hljs.highlightAll();
        }
    });
});