const synthesis = window.speechSynthesis;

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP'; // 日本語
    synthesis.speak(utterance);
}
