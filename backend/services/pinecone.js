import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const config = {
    apiKey: process.env.PINECONE_API_KEY,
    fetchApi: fetch, // Optional if needed
};

// console.log('Pinecone configuration:', config);

const client = new Pinecone(config);

export default client;