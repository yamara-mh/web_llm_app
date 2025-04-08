import { tryThink, prompt } from './agent.js';
import { speak } from './speak.js';

const keywords = ["Alexa "];

const chatFrame = document.getElementById('chat-frame');
5
const contentsArray = {contents: []};

export function addUserMessage(message) {
    if (message === '') return;

    addMessage('user', message);
    contentsArray.contents.push({ role: "user", parts: [{ text: message }] });

    for (let i = 0; i < keywords.length; i++) {
        if (message.includes(keywords[i]) === false) continue;

        contentsArray.contents.push({ role: "user", parts: [{ text: prompt() }] });
        tryThink(contentsArray);
        break;
    }
}
export function addErrorMessage(message) {
    if (message === '') return;
    addMessage('error', message);
}
export function addAgentMessage(thinkingMessage, speakMessage) {
    if (thinkingMessage !== '') {
        contentsArray.contents.push({ role: "model", parts: [{ text: thinkingMessage }] });
        addMessage('thinking', thinkingMessage);
    }
    if (speakMessage !== '') {
        contentsArray.contents.push({ role: "model", parts: [{ text: speakMessage }] });
        addMessage('ai', speakMessage);
    }
}

export function addMessage(sender, message) {
    if (message === '') return;

    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');

    if (sender === 'thinking') {
        messageContainer.classList.add('message-thinking');
    }
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
