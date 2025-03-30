import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const aiButton = document.getElementById('ai-button');
const aiButtonImage = document.getElementById('ai-button-image');

var isActivatedLLM = false;

const systemInstruction = 'あなたは自律型AIアシスタント\n'
+ '水平思考で冷静に振る舞う\n'
* 'JSONで出力\n'
+ '発言の経緯を簡潔に{#reasoning}\n'
+ '話しかけた{#target}を次の選択肢から予想\n'
+ 'null, 話者自身, 物や動物など, 誰か, Geminiかも, #Gemini\n'
+ '\n'
+ '発言の{#type}を次の選択肢から予想\n'
+ 'ひとりごと, 擬人語り, 日常会話, 議論, 相談, 疑問, 質問\n'
+ '\n'
+ '発言に対する返答をGeminiとして簡潔に{#thinking}\n'
+ '{#thinking}が不要ならnull\n'
+ 'Geminiとして発言に簡潔に{#response}\n'
+ '{#response}が不要ならnull\n'
+ 'Geminiの responseの{#category}を次の選択肢から判断\n'
+ 'null, 共感, 雑談, 補足, 助言, 重要, 警告\n'
+ '{#category}が不要ならnull\n'
+ '\n'
+ '必ずJSONのみ出力\n'


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

export async function tryThink(message, callback, errorCallback) {
    if (isActivatedLLM === false) return;

    const geminiModel = localStorage.getItem('geminiModel');
    const latestSuffix = localStorage.getItem('latestModel') === '1' ? '-latest' : '';
    const apiKey = localStorage.getItem('apiKey');

    if (!apiKey || apiKey.length < 32) {
        errorCallback("有効なAPIキーが設定されていません。設定画面でAPIキーを入力してください。");
        updateListeningStatus(false);
        return null;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: geminiModel + latestSuffix,
        systemInstruction: systemInstruction,
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
        const result = await model.generateContent({ contents:[
            { role: "user", parts: [{ text: message }] },
        ]});

        const response = result.response;
        if (!response) {
            errorCallback("LLMからの有効なレスポンスがありませんでした");
            return null;
        }

        console.log("LLM Raw Response:", response);
        resultProcessing(response, callback, errorCallback);

    } catch (error) {
        updateListeningStatus(false);
        errorCallback(error.message);
        return null;
    }
}

function resultProcessing(response, callback, errorCallback) {
    try {
        const text = response.text().slice(7).slice(0, -4);
        const parsedJson = JSON.parse(text);
        console.log(parsedJson);
        
        if (parsedJson !== null) callback(parsedJson.response);
        else {
            updateListeningStatus(false);
            errorCallback(error);
        }

    } catch (error) {
        updateListeningStatus(false);
        errorCallback(error);
    }
}
