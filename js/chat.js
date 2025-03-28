import { tryThink } from './llm.js';

const chatFrame = document.getElementById('chat-frame');

export function addMessage(sender, message) {
    if (message === '') return;

    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    if (sender === 'ai') messageContainer.classList.add('message-ai');
    if (sender === 'error') messageContainer.classList.add('message-error');

    const p = document.createElement('div');
    p.textContent = message;
    messageContainer.appendChild(p);

    chatFrame.appendChild(messageContainer);
    chatFrame.scrollTop = chatFrame.scrollHeight; // 最新のメッセージが表示されるようにスクロール

    if (sender === 'user') tryThink(message, llmResult, errorResult);
}

const llmResult = function(result) {
    addMessage('ai', result);
}
const errorResult = function(result) {
    addMessage('error', result);
}