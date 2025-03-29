import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const aiButton = document.getElementById('ai-button');
const aiButtonImage = document.getElementById('ai-button-image');

var isActivatedLLM = false;

const systemInstruction = "あなたは自律型AIアシスタント。\n"
+ "簡潔な水平思考で冷静に振る舞う。";

const schema = {
    type: SchemaType.OBJECT,
    properties: {
        reasoning: {
            type: SchemaType.STRING,
            description: '発言の経緯を reasoning',
            nullable: false,
        },
        target: {
            type: SchemaType.STRING,
            description: '話しかけた targetを予想',
            enum: ['null', '話者自身', '物や動物など', '誰か', 'Geminiかも', '#Gemini'],
            nullable: false,
        },
        type: {
            type: SchemaType.STRING,
            description: '発言の type',
            enum: ['ひとりごと', '擬人語り', '日常会話', '議論', '相談', '疑問', '質問'],
            nullable: false,
        },
        support: {
            type: SchemaType.STRING,
            description: '発言の responseをGeminiとして思考',
            nullable: true,
        },
        response: {
            type: SchemaType.STRING,
            description: 'Geminiの response',
            nullable: true,
        },
        category: {
            type: SchemaType.STRING,
            description: 'Geminiの responseの category',
            enum: ['null', '共感', '雑談', '補足', '助言', '重要', '警告'],
            nullable: true,
        },
        next_temperature: {
            type: SchemaType.NUMBER,
            description: '次の responseの創造性。範囲は0.0から1.0',
            nullable: false,
        }
    },
    required: ['reasoning', 'target', 'type', 'next_temperature'],
    propertyOrdering: ['reasoning', 'target', 'type', 'support', 'response', 'category', 'next_temperature'],
};


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
            responseMimeType: 'application/json',
            responseSchema: schema,
            maxOutputTokens: 1000,
            temperature: 0, // 創造性（会話の流れで変動するようにする？）
        },
        // TODO: dynamicRetrievalConfig を利用する
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
        const text = response.text();
        const parsedJson = JSON.parse(text);
        console.log("Parsed JSON:", parsedJson);

        if (parsedJson.response !== null) callback(parsedJson.response);

    } catch (error) {
        updateListeningStatus(false);
        errorCallback(error);
    }
}
