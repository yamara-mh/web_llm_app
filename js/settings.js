const settingsButton = document.getElementById('settings-button');
const settingsModal = new bootstrap.Modal(document.getElementById('settings-modal'));

const geminiModelSelect = document.getElementById('model-select');
const latestCheckbox = document.getElementById('latest-model-checkbox');
const apiKeyInput = document.getElementById('api-key-input');

const fontSizeSlider = document.getElementById('font-size-slider');
const speechLanguageSelect = document.getElementById('speech-language-select');

const speakVoiceSelect = document.getElementById('voice-select');
const speechSpeedSlider = document.getElementById('speech-speed-slider');
const speechPitchSlider = document.getElementById('speech-pitch-slider');
const speechVolumeSlider = document.getElementById('speech-volume-slider');


// 言語モデル
models.forEach(model => {
    const option = document.createElement('option');
    option.value = model;
    option.textContent = model;
    document.getElementById('model-select').appendChild(option);    
});

// UI
fontSizeSlider.addEventListener('input', () => {
    document.getElementById('font-size-value').textContent = Number(fontSizeSlider.value).toFixed(1);
});

// 音声
function populateVoiceList() {
    const voices = synthesis.getVoices();
    const savedIndex = localStorage.getItem('voiceIndex');
    if (savedIndex === null) savedIndex = voices.indexOf(voices.find(voice => voice.lang === window.navigator.browserLanguage));
    else savedIndex = 0;

    for (let i = 0; i < voices.length; i++) {
        const option = document.createElement('option');
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';    
        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        const voiceSelect = document.getElementById('voice-select');
        voiceSelect.appendChild(option);
    }
    speakVoiceSelect.selectedIndex = savedIndex;
}
if (synthesis.onvoiceschanged !== undefined) {
    synthesis.onvoiceschanged = populateVoiceList;
}
populateVoiceList()

speechSpeedSlider.addEventListener('input', () => {
    document.getElementById('speech-speed-value').textContent = Number(speechSpeedSlider.value).toFixed(1);
});
speechPitchSlider.addEventListener('input', () => {
    document.getElementById('speech-pitch-value').textContent = Number(speechPitchSlider.value).toFixed(1);
});
speechVolumeSlider.addEventListener('input', () => {
    document.getElementById('speech-volume-value').textContent = Number(speechVolumeSlider.value).toFixed(1);
});

// 保存された設定を読み込んで適用する関数
function loadSettings() {
    // 言語モデル
    const geminiModel = localStorage.getItem('geminiModel');
    if (geminiModel) geminiModelSelect.selectedIndex = geminiModel;
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey) apiKeyInput.value = apiKey;

    latestCheckbox.checked = localStorage.getItem('latestModel') === '1';

    // UI
    const fontSize = localStorage.getItem('fontSize');
    if (fontSize) {
        document.body.style.fontSize = fontSize + 'px';
        fontSizeSlider.value = fontSize;
    }
    speechLanguageSelect.value = localStorage.getItem('speechLanguage') || 'ja-JP';

    // 音声
    speakVoiceSelect.selectedIndex = localStorage.getItem('voiceIndex') || 0;
    speechSpeedSlider.value = localStorage.getItem('speechSpeed') || 1.0;
    speechPitchSlider.value = localStorage.getItem('speechPitch') || 1.0;
    speechVolumeSlider.value = localStorage.getItem('speechVolume') || 1.0;
}
loadSettings();

// 保存ボタンがクリックされたときの処理
document.getElementById('save-settings-button').addEventListener('click', () => {
    // 言語モデル
    localStorage.setItem('geminiModel', geminiModelSelect.selectedIndex);
    localStorage.setItem('apiKey', apiKeyInput.value);
    localStorage.setItem('latestModel', latestCheckbox.checked ? 1 : 0);
    // UI
    localStorage.setItem('fontSize', fontSizeSlider.value);
    localStorage.setItem('speechLanguage', speechLanguageSelect.value);
    // 音声
    localStorage.setItem('voiceIndex', speakVoiceSelect.selectedIndex);
    localStorage.setItem('speechSpeed', speechSpeedSlider.value);
    localStorage.setItem('speechPitch', speechPitchSlider.value);
    localStorage.setItem('speechVolume', speechVolumeSlider.value);

    // 設定を反映 
    loadSettings();
});

settingsButton.addEventListener('click', () => {
    settingsModal.toggle();
});