import express from 'express'
import bodyParser from 'body-parser'
import indexRoutes from './routes/index.js'
import leadRoutes from './routes/leads.js'
import faqRoutes from './routes/faqRoutes.js'
import imageRoutes from './routes/imageRoutes.js'
// import pdfRoutes from './routes/pdfRoutes.js'

const app = express();
const PORT = 3000;

//Body parser middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express Routes
app.use('/', indexRoutes);
app.use('/lead', leadRoutes)
// app.use('/faq', faqRoutes)
app.use('/upload-image',  imageRoutes);
// app.use('/pdf', pdfRoutes)

app.listen(PORT, () => {
    console.log("Server is listening at ", PORT);

})