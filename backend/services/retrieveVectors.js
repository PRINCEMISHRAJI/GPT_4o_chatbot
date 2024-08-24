import client from './pinecone.js'; // Adjust the path to your Pinecone client

export const retrieveSimilarVectors = async (vector) => {
  const index = client.Index('pdf-data'); // Ensure this is your correct index name
  const queryRequest = {
    topK: 10, // Number of results you want to retrieve
    vector,
    includeMetadata: true,
  };

  const result = await index.query({ queryRequest });
  return result.matches;
};
