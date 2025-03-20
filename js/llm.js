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

// LLMの応答をシミュレートする関数 (仮)
async function getLLMResponse(message) {
    // ここでLLM APIを呼び出す代わりに、仮の応答を返す
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`「${message}」についてですね。`);
        }, 1000);
    });
}
