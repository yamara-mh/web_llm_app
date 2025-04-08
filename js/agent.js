import { requestGemini } from './llm.js';
import { addAgentMessage } from './chat.js';

export function prompt() {
    return '上記は会話履歴\n'
        + '最高のアドバイスが可能な{#character}を出力\n'
        + '{#character}として振る舞う\n'
        + '水平思考で慎重に{#thinking}\n'
        + '簡潔な{#speak}を出力\n'
        + '必ず次のJSON形式で出力\n'
        + '{\n'
        + '    character: string,\n'
        + '    thinking: string,\n'
        + '    speak: string\n'
        + '}\n'
}

export async function tryThink(contents) {
    requestGemini(resultProcessing, contents);
}
function resultProcessing(response, json) {    
    addAgentMessage(json.thinking, json.speak);
}