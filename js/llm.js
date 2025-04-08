import { GoogleGenerativeAI } from '@google/generative-ai';
import { addErrorMessage } from './chat.js';

const aiButton = document.getElementById('ai-button');
const aiButtonImage = document.getElementById('ai-button-image');

var isActivatedLLM = false;


aiButton.addEventListener('click', () => {
    updateListeningStatus(!isActivatedLLM);
});
function updateListeningStatus(isActivated) {
    isActivatedLLM = isActivated;
    if (isActivatedLLM) {
        aiButton.classList.remove('btn-secondary');
        aiButton.classList.add('btn-primary');
        aiButtonImage.src='images/ai_on_icon.png';
    }
    else
    {
        aiButton.classList.remove('btn-primary');
        aiButton.classList.add('btn-secondary');
        aiButtonImage.src='images/ai_off_icon.png';
    }
}

export async function requestGemini(callback, contents) {
    if (isActivatedLLM === false) return;

    const geminiModel = localStorage.getItem('geminiModel');
    const latestSuffix = localStorage.getItem('latestModel') === '1' ? '-latest' : '';
    const apiKey = localStorage.getItem('apiKey');

    if (!apiKey || apiKey.length < 32) {
        addErrorMessage("有効なAPIキーが設定されていません。設定画面でAPIキーを入力してください。");
        updateListeningStatus(false);
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: geminiModel + latestSuffix,
        generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0,
        },
        tools: [{
            googleSearchRetrieval: {
                dynamicRetrievalConfig: {
                    mode: "MODE_DYNAMIC",
                    dynamicThreshold: 0.5
                }
            }
        }],

    });

    try {
        const result = await model.generateContent(contents);
        const response = result.response;
        if (!response) {
            addErrorMessage("LLMからの有効なレスポンスがありませんでした");
            return;
        }

        console.log(response.text());
        parseJson(response, callback);

    } catch (error) {
        updateListeningStatus(false);
        addErrorMessage(error.message);
        return;
    }
}

function parseJson(response, callback) {
    try {
        const text = response.text().slice(7).slice(0, -4);
        const parsedJson = JSON.parse(text);
        
        if (parsedJson !== null) callback(response, parsedJson);
        else {
            updateListeningStatus(false);
            addErrorMessage(error);
        }

    } catch (error) {
        updateListeningStatus(false);
        addErrorMessage(error);
    }
}
