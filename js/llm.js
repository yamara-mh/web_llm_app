const aiButton = document.getElementById('ai-button');
const aiButtonImage = document.getElementById('ai-button-image');

isActivatedLLM = false;

const models = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
];

aiButton.addEventListener('click', () => {
    isActivatedLLM = !isActivatedLLM;
    updateListeningStatus(isActivatedLLM);
});
function updateListeningStatus(isActivatedLLM){
    if (isActivatedLLM) {
        aiButton.classList.remove('btn-secondary');
        aiButton.classList.add('btn-primary');
        aiButtonImage.src='images/ai_on_icon.png';
        recognition.start();
    }
    else
    {
        aiButton.classList.remove('btn-primary');
        aiButton.classList.add('btn-secondary');
        aiButtonImage.src='images/ai_off_icon.png';
        recognition.stop();
    }
}

// LLMの応答を取得する関数
async function getCompletion(message) {
    let geminiModel = localStorage.getItem('geminiModel') || 'gemini-pro';
    let apiKey = localStorage.getItem('apiKey') || 'YOUR_API_KEY';

    // TODO: こちらが指定したJSON形式で返信するように Gemini API を利用する
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

    // ここでLLM APIを呼び出す
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`「${message}」についてですね。`);
        }, 1000);
    });
}
