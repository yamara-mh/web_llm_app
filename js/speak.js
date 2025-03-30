const synthesis = window.speechSynthesis;

export function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.voice = speechSynthesis
    .getVoices()[localStorage.getItem('voiceIndex')];

    utterance.lang = localStorage.getItem('speechLanguage');
    utterance.rate = parseFloat(localStorage.getItem('speechSpeed'));
    utterance.pitch = parseFloat(localStorage.getItem('speechPitch'));
    utterance.volume = parseFloat(localStorage.getItem('speechVolume'));
    synthesis.speak(utterance);
}

