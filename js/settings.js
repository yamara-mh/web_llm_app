const settingsButton = document.getElementById('settings-button');
const settingsModal = new bootstrap.Modal(document.getElementById('settings-modal'));

const geminiModelSelect = document.getElementById('model-select');
const latestCheckbox = document.getElementById('latest-model-checkbox');
const apiKeyInput = document.getElementById('api-key-input');

const fontSizeSlider = document.getElementById('font-size-slider');
const speechLanguageSelect = document.getElementById('speech-language-select');
const waitVoiceInputSlider = document.getElementById('wait-voice-input-slider');

const speakVoiceSelect = document.getElementById('voice-select');
const speechSpeedSlider = document.getElementById('speech-speed-slider');
const speechPitchSlider = document.getElementById('speech-pitch-slider');
const speechVolumeSlider = document.getElementById('speech-volume-slider');


// 言語モデル
const models = [
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro',
    'gemini-2.0-flash-thinking-exp-01-21',
    'gemini-2.0-pro-exp-02-05',
    'gemini-2.5-pro-exp-03-25',
];
models.forEach(model => {
    const option = document.createElement('option');
    option.value = model;
    option.textContent = model;
    document.getElementById('model-select').appendChild(option);    
});

// UI
fontSizeSlider.addEventListener('input', () => {
    //document.getElementById('font-size-value').textContent = Number(fontSizeSlider.value).toFixed(1);
});
waitVoiceInputSlider.addEventListener('input', () => {
    document.getElementById('wait-voice-input-value').textContent = Number(waitVoiceInputSlider.value).toFixed(1);
});

// 合成音声
function populateVoiceList() {
    const voices = window.speechSynthesis.getVoices();
    const savedIndex = localStorage.getItem('voiceIndex') || voices.indexOf(voices.find(voice => voice.lang === window.navigator.browserLanguage));

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
if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = populateVoiceList;
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
    geminiModelSelect.selectedIndex = models.indexOf(localStorage.getItem('geminiModel') || models[0]);
    apiKeyInput.value = localStorage.getItem('apiKey') || 'YOUR_API_KEY';
    latestCheckbox.checked = localStorage.getItem('latestModel') === '1';

    // UI
    const fontSize = localStorage.getItem('fontSize');
    if (fontSize) {
        document.body.style.fontSize = fontSize + 'px';
        fontSizeSlider.value = fontSize;
    }
    speechLanguageSelect.value = localStorage.getItem('speechLanguage') || window.navigator.browserLanguage;
    waitVoiceInputSlider.value = localStorage.getItem('waitVoiceInput') || 0.8;
    waitVoiceInputSecond = parseInt(waitVoiceInputSlider.value * 1000);

    // 音声
    speakVoiceSelect.selectedIndex = localStorage.getItem('voiceIndex') || 0;
    speechSpeedSlider.value = localStorage.getItem('speechSpeed') || 1.0;
    speechPitchSlider.value = localStorage.getItem('speechPitch') || 1.0;
    speechVolumeSlider.value = localStorage.getItem('speechVolume') || 1.0;

    // 初期設定の保存
    if (localStorage.getItem('geminiModel') === null) saveSettings();
}
loadSettings();

// 保存ボタンがクリックされたときの処理
document.getElementById('save-settings-button').addEventListener('click', () => {
    saveSettings();
    // 設定を反映 
    loadSettings();
});
function saveSettings() {
    // 言語モデル
    localStorage.setItem('geminiModel', models[geminiModelSelect.selectedIndex]);
    localStorage.setItem('apiKey', apiKeyInput.value);
    localStorage.setItem('latestModel', latestCheckbox.checked ? 1 : 0);
    // UI
    localStorage.setItem('fontSize', fontSizeSlider.value);
    localStorage.setItem('speechLanguage', speechLanguageSelect.value);    
    localStorage.setItem('waitVoiceInput', waitVoiceInputSlider.value);
    // 音声
    localStorage.setItem('voiceIndex', speakVoiceSelect.selectedIndex);
    localStorage.setItem('speechSpeed', speechSpeedSlider.value);
    localStorage.setItem('speechPitch', speechPitchSlider.value);
    localStorage.setItem('speechVolume', speechVolumeSlider.value);
}

settingsButton.addEventListener('click', () => {
    settingsModal.toggle();
});