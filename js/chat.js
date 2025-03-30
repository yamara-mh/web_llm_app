import { tryThink } from './agent.js';
import { speak } from './speak.js';

const chatFrame = document.getElementById('chat-frame');

export function addUserMessage(message) {
    if (message === '') return;
    addMessage('user', message);
    tryThink(message);
}
export function addErrorMessage(message) {
    if (message === '') return;
    addMessage('error', message);
}
export function addAgentMessage(message) {
    if (message === '') return;
    addMessage('ai', message);
}

export function addMessage(sender, message) {
    if (message === '') return;

    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    if (sender === 'ai') {
        messageContainer.classList.add('message-ai');
        speak(message);
    }
    if (sender === 'error') messageContainer.classList.add('message-error');

    const p = document.createElement('div');
    p.textContent = message;
    messageContainer.appendChild(p);

    chatFrame.appendChild(messageContainer);
    chatFrame.scrollTop = chatFrame.scrollHeight; // 最新のメッセージが表示されるようにスクロール
}
