
let chatHistory = [];
let isProcessing = false;

const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', askQuestion);

async function askQuestion() {
    if (isProcessing) return;

    const userQuery = document.getElementById('userQuery').value.trim();
    if (!userQuery) {
        alert('Please enter a study question first!');
        return;
    }

    isProcessing = true;
    submitBtn.disabled = true;
    document.getElementById('loadingSpinner').style.display = 'inline-block';

    chatHistory.push({ role: 'user', content: userQuery });

    const responseContainer = document.getElementById('responseContainer');
    responseContainer.innerHTML = `<p><strong>Response:</strong> </p>`;

    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: userQuery, history: chatHistory }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            fullText += chunk;

            responseContainer.innerHTML = `<p><strong>Response:</strong> ${fullText}</p>`;
        }

        chatHistory.push({ role: 'assistant', content: fullText });
    } catch (error) {
        console.error('Error fetching response:', error);
        alert('An error occurred while fetching response.');
    } finally {
        isProcessing = false;
        submitBtn.disabled = false;
        document.getElementById('loadingSpinner').style.display = 'none';
    }
}
