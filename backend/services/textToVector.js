import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const textToVector = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    
    console.log('OpenAI API Response:', response);

    if (!response.data || !response.data[0] || !response.data[0].embedding) {
      throw new Error('Invalid response from OpenAI API');
    }

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error getting vector from OpenAI:', error.response ? error.response.data : error.message);
    throw new Error('Failed to get vector from OpenAI');
  }
};
