import { requestGemini } from './llm.js';
import { addAgentMessage } from './chat.js';

// TODO: プロンプト関連は別クラスを作って移す
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


export async function tryThink(message) {
    requestGemini(systemInstruction, resultProcessing,
        // TODO: contents 配列を用意して追加する
        { contents:[{ role: "user", parts: [{ text: message }] }]});
}
function resultProcessing(response, json) {
    // TODO: contents 配列を用意して result.json.response を追加する
    addAgentMessage(json.response);
}