import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const aiButton = document.getElementById('ai-button');
const aiButtonImage = document.getElementById('ai-button-image');

var isActivatedLLM = false;
var history;

// スキーマ定義は変更なし
const schema = {
    situation: {
        type: SchemaType.STRING,
        description: '会話の状況',
        nullable: false,
    },
    who: {
        type: SchemaType.STRING,
        description: '誰に言った?',
        nullable: false,
        enum: ['null', '話者自身', '物や動物など', '誰か', '{#あなた}'],
    },
    what: {
        type: SchemaType.STRING,
        description: '何を話した?',
        nullable: false,
        enum: ['ひとりごと', '擬人語り', '日常会話', '議論', '相談', '質問'],
    },
    plan: {
        type: SchemaType.STRING,
        description: '発言方針',
        nullable: true,
    },
    talk: {
        type: SchemaType.STRING,
        description: '発言',
        nullable: true,
    },
    category: {
        type: SchemaType.STRING,
        description: '発言のカテゴリ',
        enum: ['共感', '雑談', '補足', '助言', '重要', '警告'],
        nullable: true,
    },
    required: ['situation', 'who', 'what', 'plan', 'talk', 'category'],
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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        // history は generateContent の第2引数で渡すか、ChatSession を使う
        model: geminiModel + latestSuffix,
        // generationConfig は getGenerativeModel の第2引数で渡す
        // generationConfig: {
        //     responseMimeType: 'application/json', // JSONモードを使う場合は設定
        //     responseSchema: schema,             // JSONモードでスキーマを使う場合
        // },
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

const prompt = "{#あなた}はAI音声アシスタント。名前は{#モニター}"
+ "\n"
+ "会話から読み取れる情報を水平思考で冷静に必ず{#推理}"
+ "{#who}に向けた話か次の選択肢から必ず出力"
+ "0:null"
+ "1:話者自身"
+ "2:ペット,電話,テレビなど"
+ "3:誰か"
+ "4:{#あなた}"
+ "\n"
+ "{#何を}話したか次の選択肢から必ず出力"
+ "0:感嘆詞,間投詞,ひとりごと"
+ "1:日常会話,自己対話"
+ "2:雑談"
+ "3:予想,意見"
+ "4:相談"
+ "5:質問"
+ "\n"
+ "水平思考で冷静に{#発言}の{#方針}を決定"
+ "{#何を}に応じた{#方針}の長さ上限"
+ "5:100文字"
+ "3:50文字"
+ "\n"
+ "口調を合わせて端的に{#発言}"
+ "{#何を}に応じた{#発言}の長さ上限"
+ "5:50文字"
+ "2:25文字"
+ "\n"
+ "{#発言}の{#区分}を次の選択肢から出力"
+ "1:相槌"
+ "2:共感"
+ "3:雑談"
+ "4:補足"
+ "5:助言"
+ "6:確認"
+ "7:重要"
+ "8:警告"
+ "9:危険"
+ "\n"
+ "{#発言}がnullなら{#区分}もnull"
+ "{#誰に}が3以下なら{#方針}はnull"
+ "{#何を}が4以下なら{#方針}はnull"
+ "{#誰に}が2以下なら{#発言}はnull"
+ "{#何を}が2以下なら{#発言}はnull"
+ "\n"
+ "※json形式で出力"
+ "\n";