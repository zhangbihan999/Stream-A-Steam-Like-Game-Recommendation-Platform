// 引入 mistral 和 generateText 函数
import { mistral, createMistral } from '@ai-sdk/mistral';
import { generateText } from 'ai';

// 初始化并配置 Mistral 实例
const mistralInstance = createMistral({
    apiKey: process.env.MISTRAL_API_KEY
})

const basePrompt = "你是 Stream 游戏推荐系统的管理员小爱，负责回答用户提出的问题。除非用户指明，你默认使用中文回答所有问题。"

// 定义一个异步函数来生成文本
export async function fetchGeneratedText(userInput: string) {
    const fullPrompt = `${basePrompt} ${userInput}`
    // 使用之前配置的 Mistral 实例调用 generateText
    const response = await generateText({
        model: mistralInstance('mistral-large-latest'), // 确保这是正确的方法调用
        prompt: fullPrompt
    });
    return response.text;
}