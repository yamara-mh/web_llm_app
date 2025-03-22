// 設定を保存・適用する処理

// 保存された設定を読み込んで適用する関数
function loadSettings() {
    // 文字サイズ
    const fontSize = localStorage.getItem('fontSize');
    if (fontSize) {
        document.body.style.fontSize = fontSize + 'px';
        document.getElementById('font-size-slider').value = fontSize;
    }

    // 言語
    const speechLanguage = localStorage.getItem('speechLanguage');
    if (speechLanguage) {
        document.getElementById('speech-language-select').value = speechLanguage;
    }

    // 速度
    const speechSpeed = localStorage.getItem('speechSpeed');
    if (speechSpeed) {
        document.getElementById('speech-speed-slider').value = speechSpeed;
    }

    // 高さ
    const speechPitch = localStorage.getItem('speechPitch');
    if (speechPitch) {
        document.getElementById('speech-pitch-slider').value = speechPitch;
    }

    // 音量
    const speechVolume = localStorage.getItem('speechVolume');
    if (speechVolume) {
        document.getElementById('speech-volume-slider').value = speechVolume;
    }

    // Geminiモデル
    const geminiModel = localStorage.getItem('geminiModel');
    if (geminiModel) {
        document.getElementById('model-select').value = geminiModel;
    }

    // APIキー
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey) {
        document.getElementById('api-key-input').value = apiKey;
    }

    // プロンプト
    const prompt = localStorage.getItem('prompt');
    if (prompt) {
        document.getElementById('prompt-textarea').value = prompt;
    }
}

// 保存ボタンがクリックされたときの処理
document.getElementById('save-settings-button').addEventListener('click', () => {
    // 各設定項目の値を取得
    const fontSize = document.getElementById('font-size-slider').value;
    const speechLanguage = document.getElementById('speech-language-select').value;
    const speechSpeed = document.getElementById('speech-speed-slider').value;
    const speechPitch = document.getElementById('speech-pitch-slider').value;
    const speechVolume = document.getElementById('speech-volume-slider').value;
    const geminiModel = document.getElementById('model-select').value;
    const apiKey = document.getElementById('api-key-input').value;
    const prompt = document.getElementById('prompt-textarea').value;

    // localStorageに保存
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('speechLanguage', speechLanguage);
    localStorage.setItem('speechSpeed', speechSpeed);
    localStorage.setItem('speechPitch', speechPitch);
    localStorage.setItem('speechVolume', speechVolume);
    localStorage.setItem('geminiModel', geminiModel);
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('prompt', prompt);

    // 設定を反映 
    loadSettings();
    // TODO: speak.js, llm.jsの更新は後で実施
});

// ページ読み込み時に設定を適用
loadSettings();