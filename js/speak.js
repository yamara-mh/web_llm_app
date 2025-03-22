const synthesis = window.speechSynthesis;

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    // 設定を反映
    utterance.lang = localStorage.getItem('speechLanguage') || 'ja-JP';
    utterance.rate = parseFloat(localStorage.getItem('speechSpeed')) || 1.0;
    utterance.pitch = parseFloat(localStorage.getItem('speechPitch')) || 1.0;
    utterance.volume = parseFloat(localStorage.getItem('speechVolume')) || 1.0;
    synthesis.speak(utterance);
}
