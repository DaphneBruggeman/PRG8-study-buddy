let chatHistory = [];
let isProcessing = false;

function askQuestion() {
    if (isProcessing) {
        return;
    }

    const userQuery = document.getElementById('userQuery').value.trim();
    if (!userQuery) {
        alert('Please enter a study question first!');
        return;
    }

    // Set processing flag to true
    isProcessing = true;

    // Add user query to chat history
    chatHistory.push({ role: 'user', content: userQuery });

    // UI adjustments: disable the button and show the spinner
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;

    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'inline-block';

    // Fetch to server endpoint /chat
    fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userQuery, history: chatHistory }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Add assistant response to chat history
        chatHistory.push({ role: 'assistant', content: data.response });

        // Update UI with response
        const responseContainer = document.getElementById('responseContainer');
        responseContainer.innerHTML = `<p><strong>Response:</strong> ${data.response}</p>`;
    })
    .catch(error => {
        console.error('Error fetching response:', error);
        alert('An error occurred while fetching response.');
    })
    .finally(() => {
        // Enable the button and hide the spinner
        submitBtn.disabled = false;
        loadingSpinner.style.display = 'none';
    });
}
