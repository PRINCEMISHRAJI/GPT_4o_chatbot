import express from 'express'
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/welcome', (req,res) => {
    res.json({ message : "Hello There! I'm here to help you to connect with top-rated contractors. How can i assist you today? "})
})


router.post('/service/option/:value', (req, res) => {
    const serviceType = req.params.value;

    // Logic to handle the service type selection
    res.json({ message: `You selected ${serviceType}. Please provide your details.` });
});


router.get('/service_options', (req,res) => {
    res.json({
        options : [
            "Fill in a Form",
            "Call a Number",
            "Set an Appointment"
        ]
    });
});

export default router;