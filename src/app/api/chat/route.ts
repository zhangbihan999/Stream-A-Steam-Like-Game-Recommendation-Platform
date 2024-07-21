// 引入 mistral 和 generateText 函数
import { mistral, createMistral } from '@ai-sdk/mistral';
import { generateText } from 'ai';

// 初始化并配置 Mistral 实例
const mistralInstance = createMistral({
    apiKey: "0U3FzEA0ut3pQj16wt4PjdH6BBfZIFXZ"
})

// 定义一个异步函数来生成文本
export async function fetchGeneratedText(prompt: string) {
    // 使用之前配置的 Mistral 实例调用 generateText
    const response = await generateText({
        model: mistralInstance('mistral-large-latest'), // 确保这是正确的方法调用
        prompt: prompt
    });
    return response.text;
}