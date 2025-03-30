import { addMessage } from './chat.js';

const micButton = document.getElementById('mic-button');
const micButtonImage = document.getElementById('mic-button-image');
const messageInput = document.getElementById('message-input');
const messageToast = document.getElementById('message-toast');

const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();

var isListening = false;
var latestUpdateTime = 0;
var waitVoiceInputSecond;

micButton.addEventListener('click', () => {
    isListening = !isListening;
    updateLLMStatus(isListening);
});
function updateLLMStatus(isListeningFlag) {
    if (isListeningFlag) {
        micButton.classList.remove('btn-secondary');
        micButton.classList.add('btn-primary');
        micButtonImage.src='images/mic_on_icon.png';
        
        recognition.lang = localStorage.getItem('speechLanguage');
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.start();
    }
    else
    {
        micButton.classList.remove('btn-primary');
        micButton.classList.add('btn-secondary');
        micButtonImage.src='images/mic_off_icon.png';
        recognition.stop();
    }
}

// 音声認識の結果を受け取るイベント
recognition.onresult = (event) => {
    const currentResult = event.results[event.results.length - 1];
    
    const transcript = currentResult[0].transcript;
    messageInput.value = transcript;
    
    if (currentResult.isFinal == false || transcript.length == 0) return;

    latestUpdateTime = Date.now();
    setTimeout(function() {
        if (latestUpdateTime <= waitVoiceInputSecond) return;
        
        addMessage('user', transcript);
        messageInput.value = '';
    }, waitVoiceInputSecond);
};

recognition.onend = () => {
    if (isListening) recognition.start();
    else UpdateListeningStatus(false);
};

// エラーハンドリング
recognition.onerror = (event) => {
    if (event.error === 'no-speech' ||
        event.error === 'bad-grammar') {
            if (isListening) recognition.start();
    }
    else {
        isListening = false;
        UpdateListeningStatus(false);
        // console.error('音声認識エラー: ', event.error);
        // TODO: messageToast でエラーメッセージを表示する
    }
};