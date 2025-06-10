let chatHistory = [];
let isProcessing = false;

const submitBtn = document.getElementById('submitBtn');
const responseContainer = document.getElementById('responseContainer');

submitBtn.addEventListener('click', askQuestion);

async function askQuestion() {
    if (isProcessing) return;

    const userQueryInput = document.getElementById('userQuery');
    const userQuery = userQueryInput.value.trim();

    if (!userQuery) {
        alert('Vul eerst een vraag in');
        return;
    }

    isProcessing = true;
    submitBtn.disabled = true;

    chatHistory.push({ role: 'user', content: userQuery });

    responseContainer.innerHTML = `
        <p><strong>Antwoord:</strong></p>
        <p><em>Even kijken in het magazijn...</em></p>
    `;

    try {
        const response = await fetch('https://prg8-study-buddy.onrender.com/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: userQuery, history: chatHistory }),
        });

        if (!response.ok) {
            throw new Error('Netwerkfout bij het ophalen van antwoord');
        }
// streamer, woord voor woord
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            fullText += chunk;

            responseContainer.innerHTML = `
                <p><strong>Antwoord:</strong></p>
                <p>${fullText}</p>
            `;
        }

        chatHistory.push({ role: 'assistant', content: fullText });
    } catch (error) {
        console.error('Fout bij ophalen antwoord:', error);
        alert('Er is iets misgegaan bij het ophalen van het antwoord');
    } finally {
        isProcessing = false;
        submitBtn.disabled = false;
        userQueryInput.value = '';
    }
}
