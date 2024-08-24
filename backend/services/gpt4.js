import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateResponse = async (query, context) => {
  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Context: ${context}\n\nQuestion: ${query}` }
      ],
      max_tokens: 150,  // Use this parameter to control the length of the response
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating response with GPT-4:', error);
    throw error;
  }
};