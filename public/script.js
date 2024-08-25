const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const exportButton = document.getElementById('exportButton');
const clearButton = document.getElementById('clearButton'); // مرجع زر إفراغ المحادثة
const loadingScreen = document.getElementById('loadingScreen');
const app = document.getElementById('app');

const themeToggle = document.getElementById('themeToggle');


document.addEventListener("DOMContentLoaded", function() {
    loadingScreen.style.display = 'flex';

    setTimeout(() => {
        loadingScreen.style.display = 'none';
        app.style.display = 'block';
    }, 6000);
});

window.onload = function() {
    loadConversations();
};

function saveConversation(sender, message) {
    let conversations = JSON.parse(localStorage.getItem('conversations')) || [];
    conversations.push({ sender, message });
    localStorage.setItem('conversations', JSON.stringify(conversations));
}

function loadConversations() {
    let conversations = JSON.parse(localStorage.getItem('conversations')) || [];
    conversations.forEach(convo => {
        appendMessage(convo.sender, convo.message, false);
    });
}

async function sendMessage() {
    const userMessage = userInput.value;
    if (!userMessage) return;

    appendMessage('Gebruiker', userMessage);
    userInput.value = '';

    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    const botMessage = data.reply;
    appendMessage('Bot', botMessage);
    saveConversation('Bot', botMessage);
}

function appendMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<span>${sender}:</span> ${message}`;
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

clearButton.addEventListener('click', function() {
    localStorage.removeItem('conversations'); 
    chatbox.innerHTML = ''; 
});

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

exportButton.addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let conversations = JSON.parse(localStorage.getItem('conversations')) || [];
    let content = "";

    conversations.forEach(convo => {
        content += `${convo.sender}: ${convo.message}\n`;
    });

    doc.text(content, 10, 10);
    doc.save('conversation.pdf');
});


themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        themeToggle.textContent = 'Switch to Dark Mode';
    } else {
        themeToggle.textContent = 'Switch to Light Mode';
    }
});