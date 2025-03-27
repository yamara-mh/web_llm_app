import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const aiButton = document.getElementById('ai-button');
const aiButtonImage = document.getElementById('ai-button-image');

var isActivatedLLM = false;
var history;

const schema = {
    type: SchemaType.OBJECT,
    properties: {
        考察: {
            type: SchemaType.STRING,
            // description: '会話から読み取れる情報の考察、推理',
            nullable: false,
        },
        誰に: {
            type: SchemaType.STRING,
            // description: '発言が誰に向けられたか',
            enum: ['null', '話者自身', '物や動物など', '誰か', '{#あなた}かも', '{#あなた}'],
            nullable: false,
        },
        何を: {
            type: SchemaType.STRING,
            // description: '発言の内容',
            enum: ['ひとりごと', '擬人語り', '日常会話', '議論', '相談', '質問'],
            nullable: false,
        },
        方針: {
            type: SchemaType.STRING,
            // description: 'AIの発話方針',
            nullable: true,
        },
        発話: {
            type: SchemaType.STRING,
            // description: 'AIの実際の応答発話',
            nullable: true,
        },
        区分: {
            type: SchemaType.STRING,
            // description: 'AIの発話の区分',
            enum: ['共感', '雑談', '補足', '助言', '重要', '警告'],
            nullable: true,
        },
    },
    required: ['考察', '誰に', '何を']
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

export async function tryThink(message, callback) {
    if (isActivatedLLM === false) return;
    try {
        const result = await getCompletion(message);
        // result が null でないことを確認
        if (result) {
            callback(resultProcessing(result));
        } else {
            console.error("LLMからの応答がありませんでした。");
            // エラー時のコールバック処理（必要に応じて）
            // callback(null);
        }
    } catch (error) {
        console.error("tryThink中にエラーが発生しました:", error);
        // エラー時のコールバック処理（必要に応じて）
        // callback(null);
    }
};

// LLMの応答を取得する関数
async function getCompletion(message) {
    console.log("getCompletion");
    const geminiModel = localStorage.getItem('geminiModel');
    const latestSuffix = localStorage.getItem('latestModel') === '1' ? '-latest' : '';
    const apiKey = localStorage.getItem('apiKey');

    // APIキーが設定されていない場合のチェックを追加
    if (!apiKey || apiKey.length < 32) {
        console.error("有効なAPIキーが設定されていません。");
        alert("有効なAPIキーが設定されていません。設定画面でAPIキーを入力してください。");
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

    // プロンプトとメッセージを結合
    const fullPrompt = prompt + message;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        });

        const response = result.response;
        if (!response) {
            console.error("LLMからの有効なレスポンスがありませんでした。", result);
            return null;
        }

        console.log("LLM Raw Response:", response);
        return response;

    } catch (error) {
        updateListeningStatus(false);
        console.error("[GoogleGenerativeAI Error]: Error fetching from API:", error); // エラーログを改善
        if (error.message) {
            console.error("Error message:", error.message);
        }
        // 404エラーの場合、モデル名が正しいか、APIキーが有効か確認するよう促す
        if (error.message && error.message.includes('404')) {
            alert(`モデルが見つかりません (${geminiModel + latestSuffix})。設定画面でモデル名を確認するか、APIキーが有効か確認してください。`);
        } else if (error.message && error.message.includes('API key not valid')) {
            alert("APIキーが無効です。設定画面で正しいAPIキーを入力してください。");
        }
        return null;
    }
}

function resultProcessing(response) {

    // history = response.history

    console.log("resultProcessing");

    try {
        const text = response.text();
        console.log("LLM Response Text:", text);
        const parsedJson = JSON.parse(text);
        console.log("Parsed JSON:", parsedJson);
        return parsedJson;

    } catch (error) {
        updateListeningStatus(false);
        console.error("JSONのパースまたは結果処理中にエラーが発生しました:", error);
        return { error: "Failed to process LLM response", details: error.message, rawText: response.text() };
    }
}

const prompt = "{#あなた}はAI音声アシスタント/n"
+ "{#あなた}の名前は{#モニター}\n"
+ "\n"
+ "発言から会話の流れを水平思考で冷静に{#考察}\n"
+ "{#考察}から{#誰に}向けた発言か出力\n"
+ "\n"
+ "発言者が{#何を}話しているか出力\n"
+ "\n"
+ "水平思考で冷静に{#発言}の{#方針}を決定\n"
+ "{#誰に}が3以下なら{#方針}はnull\n"
+ "{#何を}が4以下なら{#方針}はnull\n"
+ "{#何を}に応じた{#方針}の長さ上限\n"
+ "5:100文字"
+ "3:50文字"
+ "\n"
+ "口調を合わせて端的に{#発話}\n"
+ "{#誰に}が2以下なら{#発話}はnull\n"
+ "{#何を}が2以下なら{#発話}はnull\n"
+ "{#何を}に応じた{#発話}の長さ上限\n"
+ "5:50文字"
+ "2:25文字"
+ "\n"
+ "{#発話}の{#区分}を出力\n"
+ "{#発話}がnullなら{#区分}もnull\n";