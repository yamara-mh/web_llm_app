const chatFrame = document.getElementById('chat-frame');
const messageInput = document.getElementById('message-input');


// チャットメッセージを追加する関数
function addMessage(sender, message) {
    const messageContainer = document.createElement('div'); // 各メッセージを囲むdiv
    messageContainer.classList.add('message-container');

    const senderElement = document.createElement('span');
    senderElement.textContent = `${sender}: `;
    senderElement.classList.add('sender');
    messageContainer.appendChild(senderElement);

    if (message.trim() !== '') {
        const p = document.createElement('div');
        p.textContent = message;
        messageContainer.appendChild(p);
    }

    chatFrame.appendChild(messageContainer);
    chatFrame.scrollTop = chatFrame.scrollHeight; // 最新のメッセージが表示されるようにスクロール
}

const settingsButton = document.getElementById('settings-button');
const settingsModal = new bootstrap.Modal(document.getElementById('settings-modal'));

settingsButton.addEventListener('click', () => {
  settingsModal.toggle();
});