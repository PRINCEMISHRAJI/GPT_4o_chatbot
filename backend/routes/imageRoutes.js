import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { OpenAI } from 'openai'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();
const router = express.Router();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Initializing API client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

// SETTING STORAGE FOR IMAGES
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

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Image upload and processing route
router.post('/', upload.single('image'), async (req, res) => {
    const text = req.body.text || "Describe this image";
    const imageFile = req.file;

    let base64ImageDataUrl = '';
    if (imageFile) {
        const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        console.log("Full image path:", imagePath);

        if (!fs.existsSync(imagePath)) {
            console.error("File not found:", imagePath);
            return res.status(500).json({ error: 'File not found.' });
        }

        try {
            // Convert image to base64
            const imageFile = fs.readFileSync(imagePath);
            const base64Image = imageFile.toString('base64');
            base64ImageDataUrl = `data:image/${path.extname(imagePath).slice(1)};base64,${base64Image}`

            // Optionally, delete the file after processing
            fs.unlinkSync(imagePath);
        } catch (error) {
            console.error('Error during image processing:', error);
            res.status(500).json({ error: `An error occurred while processing the image: ${error.message}` });
        }
    }
    try {
        const messages = [
            {
                role: 'user',
                content: [{ type: 'text', text: text }]
            }
        ];

        if (base64ImageDataUrl) {
            messages[0].content.push({
                type: 'image_url',
                image_url: {
                    url: base64ImageDataUrl
                }
            });
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o', // Ensure you're using the correct model
            messages: messages,
            max_tokens: 300
        });

        console.log("OpenAI response:", response);

        const description = response.choices[0]?.message?.content || "No description available.";
        res.json({ description });
    } catch (error) {
        console.error('Error during image processing:', error);
        res.status(500).json({ error: `An error occurred while processing the request: ${error.message}` });
    }
});

export default router;
