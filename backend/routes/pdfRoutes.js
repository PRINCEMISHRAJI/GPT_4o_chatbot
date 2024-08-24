import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import client from '../services/pinecone.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { textToVector } from '../services/textToVector.js'; // Import your textToVector function'
import pkg from '@pinecone-database/pinecone';
const { upsertCommand } = pkg;

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// PDF processing endpoint
router.post('/', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const pdfPath = path.join(__dirname, '..', 'uploads', req.file.filename);

  try {
    // Read and parse the PDF file
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);

    // Extract text from the PDF
    const pdfText = pdfData.text;

    // Split text into chunks if needed
    const chunks = pdfText.match(/.{1,1000}/g); // Adjust chunk size as needed

    // Prepare data for Pinecone
    const index = client.Index('pdf-data');
    const ids = chunks.map((_, idx) => `chunk-${idx}`);

    const vectorPromises = chunks.map(async (chunk, idx) => {
      try {
        const vector = await textToVector(chunk); // Convert text chunk to vector
        return {
          id: ids[idx],
          values: vector,
          metadata: { id: ids[idx] } // Optional metadata
        };
      } catch (error) {
        console.error(`Error converting chunk ${idx} to vector:`, error);
        return null; // Skip problematic chunks
      }
    });

    const vectors = (await Promise.all(vectorPromises)).filter(Boolean);

    try {
      await index.upsert({
        vectors: vectors // Ensure this is an array of objects with id, values, and optionally metadata
      });
    } catch (error) {
      console.error('Error upserting vectors to Pinecone:', error);
    }

    // Optionally, you can delete the file after processing
    fs.unlinkSync(pdfPath);
    // res.json({ message: 'PDF processed and data stored successfully.' });
  } catch (error) {
    console.error('Error processing the PDF:', error);
    res.status(500).json({ error: `An error occurred while processing the PDF: ${error.message}` });
  }
});

export default router;