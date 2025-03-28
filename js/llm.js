import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const aiButton = document.getElementById('ai-button');
const aiButtonImage = document.getElementById('ai-button-image');

var isActivatedLLM = false;
var history;

const prompt = "あなたは自律型AIアシスタント。\n"
+ "必ず水平思考で冷静に振る舞う。\n";

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
            description: '発言に対する responseをGeminiとして思考',
            nullable: true,
        },
        response: {
            type: SchemaType.STRING,
            description: 'Geminiの簡潔な response',
            nullable: true,
        },
        category: {
            type: SchemaType.STRING,
            description: 'Geminiの responseの category',
            enum: ['共感', '雑談', '補足', '助言', '重要', '警告'],
            nullable: true,
        },
    },
    required: ['reasoning', 'target', 'type'],
    propertyOrdering: ['reasoning', 'target', 'type', 'support', 'response', 'category'],
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
        generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: schema, // 定義したスキーマを使用
        },
    });
    
    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            contents: [{ role: "user", parts: [{ text: message }] }],
        });

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

    // history = response.history
    console.log("resultProcessing : " + response.history);

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
