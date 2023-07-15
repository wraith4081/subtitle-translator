import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_KEY, SystemInput } from '../config';
import parseJSON from './parseJSON';

const configuration = new Configuration({
    apiKey: OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function translateChunk(input: string[], reRun: boolean = false) {
    const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: 'system',
                content: SystemInput
            },
            {
                role: 'user',
                content: JSON.stringify({ input })
            }
        ],
    });

    const result = parseJSON(chatCompletion.data.choices[0].message?.content as any);

    if (reRun && result.success !== true) {
        throw new Error('Error while translating chunk');
    }

    return {success: result.success, content: result.content?.output || []} as { success: boolean, content: string[] };
}