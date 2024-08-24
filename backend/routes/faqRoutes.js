import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateResponse } from '../services/gpt4.js'; // Import the function to generate responses

const router = express.Router();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load hardcoded text from sample.txt
const textFilePath = path.join(__dirname, '..', '05-versions-space.pdf.txt');

// Read the file content asynchronously
let hardcodedText =  fs.readFileSync(textFilePath, 'utf-8');

// ChatGPT endpoint
router.post('/', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Please provide a query.' });
  }

  try {
    // Use hardcoded data as context
    const context = hardcodedText;
    // console.log(context,  'context');

    

    // Generate a response based on the query and context
    const answer = await generateResponse(query, context);
    
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while generating the response.' });
  }
});

export default router;
