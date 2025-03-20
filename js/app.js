const chatMessages = document.getElementById('chat-messages');
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

    chatMessages.appendChild(messageContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight; // 最新のメッセージが表示されるようにスクロール
}

// スクロールイベントの監視
chatMessages.addEventListener('scroll', () => {

});

// LLMの応答をシミュレートする関数 (仮)
async function getLLMResponse(message) {
    // ここでLLM APIを呼び出す代わりに、仮の応答を返す
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`「${message}」についてですね。`);
        }, 1000);
    });
}