import fs from 'fs';
import pdfParse from 'pdf-parse';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const extractTextFromPDF = async (pdfPath) => {
  try {
    console.log('Attempting to read file:', pdfPath);
    if (fs.existsSync(pdfPath)) {
      console.log('File exists.');
      const pdfBuffer = fs.readFileSync(pdfPath);
      const pdfData = await pdfParse(pdfBuffer);
      return pdfData.text;
    } else {
      console.error('File does not exist at the specified path.');
    }
  } catch (error) {
    console.error('Error reading or parsing PDF:', error);
  }
};

export default extractTextFromPDF;