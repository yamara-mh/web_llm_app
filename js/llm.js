const models = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
];

// DOM要素
const aiButton = document.getElementById('ai-button');
const aiButtonImage = document.getElementById('ai-button-image');


isActivatedLLM = false;


aiButton.addEventListener('click', () => {
    isActivatedLLM = !isActivatedLLM;
    UpdateListeningStatus(isActivatedLLM);
});
function UpdateListeningStatus(isActivatedLLM){
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

// 設定から読み込んだ値を格納する変数
let geminiModel = localStorage.getItem('geminiModel') || 'gemini-pro';
let apiKey = localStorage.getItem('apiKey') || 'YOUR_API_KEY'; //TODO:
let userPrompt = localStorage.getItem('prompt') || '';

// LLMの応答を取得する関数
async function getCompletion(message) {
    // TODO: JSON形式で返信するように
    // Gemini API を呼んで、応答を取得する
    // こちらが指定したJSON形式で返信するように実装する
    // 実装の参考URL: https://ai.google.dev/gemini-api/docs/structured-output?hl=ja&lang=web

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

    // ここでLLM APIを呼び出す
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`「${message}」についてですね。`);
        }, 1000);
    });
}
