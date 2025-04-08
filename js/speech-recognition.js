import { addUserMessage } from './chat.js';

const micButton = document.getElementById('mic-button');
const micButtonImage = document.getElementById('mic-button-image');
const messageInput = document.getElementById('message-input');
const messageToast = document.getElementById('message-toast');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

var isListening = false;

micButton.addEventListener('click', () => {
    isListening = !isListening;
    updateListeningStatus(isListening);
});
function updateListeningStatus(isListeningFlag) {
    if (isListeningFlag) {
        micButton.classList.remove('btn-secondary');
        micButton.classList.add('btn-primary');
        micButtonImage.src='images/mic_on_icon.png';
        
        recognition.lang = localStorage.getItem('speechLanguage');
        recognition.continuous = true;
        recognition.start();

        waitVoiceInputSecond = localStorage.getItem('waitVoiceInput');
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
    addUserMessage(event.results[event.resultIndex][0].transcript);
}

recognition.onend = () => {
    if (isListening) recognition.start();
    else updateListeningStatus(false);
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