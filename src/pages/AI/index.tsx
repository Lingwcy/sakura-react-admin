import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText, streamText, generateObject } from 'ai';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod'
const openrouter = createOpenRouter({
    apiKey: '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',
});


const chatModel = openrouter.chat('deepseek/deepseek-chat-v3.1:free');


const completionModel = openrouter.completion(
    'deepseek/deepseek-chat-v3.1:free',
);




export default function AIChatPage() {
    const [output, setOutPut] = useState<any>()
    const [input, setInput] = useState<string>('')
    const [usage, setUsage] = useState<any>()
    const [finishInfo, setFinishInfo] = useState<any>()

    const handleSubmit = async (input: string) => {
        const { textStream, usage } = streamText({
            model: chatModel,
            prompt: input,
            onFinish({ text, finishReason, usage, response, steps, totalUsage }) {
                setFinishInfo({
                    text,
                    finishReason,
                    usage,
                    response,
                    steps,
                    totalUsage
                });

                const messages = response.messages;
            },

        });

        setOutPut('');
        setUsage(await usage)
        for await (const delta of textStream) {
            setOutPut(prev => prev + delta);
        }
    }
    return (
        <div>
            <Input value={input} onChange={(e) => setInput(e.target.value)} />
            <div>
                <pre>
                    {output}
                </pre>
                <span>{JSON.stringify(usage)}</span>
                {finishInfo && (
                    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
                        <h3>完成信息:</h3>
                        <div><strong>完成原因:</strong> {finishInfo.finishReason}</div>
                        <div><strong>使用量:</strong> <pre>{JSON.stringify(finishInfo.usage, null, 2)}</pre></div>
                        <div><strong>响应:</strong> <pre>{JSON.stringify(finishInfo.response, null, 2)}</pre></div>
                        <div><strong>步骤:</strong> <pre>{JSON.stringify(finishInfo.steps, null, 2)}</pre></div>
                        <div><strong>总使用量:</strong> <pre>{JSON.stringify(finishInfo.totalUsage, null, 2)}</pre></div>
                        <div><strong>文本:</strong> <pre>{finishInfo.text}</pre></div>
                    </div>
                )}
            </div>
            <Button onClick={() => handleSubmit(input)}>发送</Button>
        </div>
    )
}

