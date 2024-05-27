const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const audio = new Audio('bing.mp3'); 
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
};

// Get user name and join chat
const name1 = prompt("Enter your name to join");
if (name1) {
    socket.emit('new-user-joined', name1);
}

// Handle 'user-joined' event
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message, { name: name1 });
    messageInput.value = '';
});

// Handle 'receive' event
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// Handle 'left' event
socket.on('left', name => {
    append(`${name} left the chat`, 'right'); // Corrected to 'left'
});
