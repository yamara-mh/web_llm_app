// app.js

// Web Speech API (音声認識)
const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
recognition.lang = 'ja-JP';
recognition.continuous = true;
recognition.interimResults = true;

// Web Speech API (音声合成)
const synthesis = window.speechSynthesis;

// DOM要素
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input'); // HTMLInputElement
const voiceInputButton = document.getElementById('voice-input-button');
const sendButton = document.getElementById('send-button');

// 音声入力ボタンのクリックイベント
voiceInputButton.addEventListener('click', () => {
    recognition.start();
});

// 音声認識の結果を受け取るイベント
recognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    messageInput.value = result;
};

// エラーハンドリング
recognition.onerror = (event) => {
    console.error('音声認識エラー:', event.error);
    addMessage('システム', '音声認識エラーが発生しました。');
};

// 送信ボタンのクリックイベント
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() !== '') {
        addMessage('あなた', message);
        messageInput.value = '';
        // LLMの応答をシミュレート (仮)
        getLLMResponse(message).then(response => {
            addMessage('LLM', response);
            speak(response);
        });
    }
});

// チャットメッセージを追加する関数
function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // 最新のメッセージが表示されるようにスクロール
}

// LLMの応答をシミュレートする関数 (仮)
async function getLLMResponse(message) {
    // ここでLLM APIを呼び出す代わりに、仮の応答を返す
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`「${message}」についてですね。`);
        }, 1000);
    });
}

// 音声合成を行う関数
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP'; // 日本語
    synthesis.speak(utterance);
}