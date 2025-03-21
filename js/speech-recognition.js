const micButton = document.getElementById('mic-button');
const micButtonImage = document.getElementById('mic-button-image');
const messageToast = document.getElementById('message-torst');

const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
recognition.lang = 'ja-JP';
recognition.continuous = true;
recognition.interimResults = true;

isListening = false;


micButton.addEventListener('click', () => {
    isListening = !isListening;
    UpdateLLMStatus(isListening);
});
function UpdateLLMStatus(isListeningFlag) {
    if (isListeningFlag) {
        micButton.classList.remove('btn-secondary');
        micButton.classList.add('btn-primary');
        micButtonImage.src='images/mic_on_icon.png';
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

    console.log(currentResult);
    
    if (currentResult.isFinal) {
        addMessage('ユーザ', transcript);
        messageInput.value = '';
    }
};

recognition.onend = () => {
    if (isListening) recognition.start();
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
        //console.error('音声認識エラー: ', event.error);

        // TODO : トーストでエラーメッセージを表示する
    }
};