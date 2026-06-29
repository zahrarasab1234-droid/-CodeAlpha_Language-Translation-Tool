// Language mapper for SpeechSynthesis API
function getLanguageCode(lang) {
    const langMap = {
        'en': 'en-US', 'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE',
        'it': 'it-IT', 'pt': 'pt-PT', 'ru': 'ru-RU', 'zh': 'zh-CN',
        'ja': 'ja-JP', 'ko': 'ko-KR', 'hi': 'hi-IN', 'ar': 'ar-SA',
        'tr': 'tr-TR', 'nl': 'nl-NL', 'pl': 'pl-PL', 'sv': 'sv-SE',
        'vi': 'vi-VN', 'th': 'th-TH', 'el': 'el-GR', 'cs': 'cs-CZ'
    };
    return langMap[lang] || 'en-US';
}

// Text-to-Speech execution engine
function speakText(text, langCode) {
    if (!text.trim()) return;

    // Cancel any current playing audios
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageCode(langCode);
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
}

// Event Listeners for Manual Speaker Triggers
document.getElementById('speakInputBtn').addEventListener('click', () => {
    const text = document.getElementById('inputText').value;
    const lang = document.getElementById('sourceLang').value;
    if(!text.trim()) return alert("Please enter text to speak.");
    speakText(text, lang);
});

document.getElementById('speakOutputBtn').addEventListener('click', () => {
    const text = document.getElementById('outputText').innerText;
    const lang = document.getElementById('targetLang').value;
    if(!text.trim() || text === "Translation will appear here..." || text === "Translating...") {
        return alert("No translation available to speak yet.");
    }
    speakText(text, lang);
});

// Primary Translation Logic Architecture
document.getElementById('translateBtn').addEventListener('click', async () => {
    const text = document.getElementById('inputText').value;
    const source = document.getElementById('sourceLang').value;
    const target = document.getElementById('targetLang').value;
    const outputDiv = document.getElementById('outputText');
    const translateBtn = document.getElementById('translateBtn');

    if (!text.trim()) {
        alert("Please enter some text.");
        return;
    }

    outputDiv.innerText = "Translating...";
    translateBtn.disabled = true;

    // Free Translation Request Engine
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.responseData) {
            const translatedResult = data.responseData.translatedText;
            outputDiv.innerText = translatedResult;
            
            // AUTOMATIC SPEAKER FEATURE: Speaks out target text instantly right after translating
            speakText(translatedResult, target);
        } else {
            outputDiv.innerText = "Error: Translation failed.";
        }
    } catch (error) {
        console.error("Error:", error);
        outputDiv.innerText = "Error: Could not connect to translation service.";
    } finally {
        translateBtn.disabled = false;
    }
});