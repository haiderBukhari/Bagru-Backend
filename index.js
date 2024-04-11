import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import { readdirSync } from 'fs'; // Importing fs module to read directory contents
import connectDB from './config/MongooseConnection.js';
import RegisterationRoutes from './Routes/Registerationroutes.js';
import { SendMessage } from './utils/sendMessage.js';
import { SendEmail } from './utils/sendEmail.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
config();

// Serving static videos directory
app.use('/videos', express.static('./courses'));

app.use('/register', RegisterationRoutes);

app.post('/contact', (req, res) => {
    const { fullName, email, message, phoneNumber, subject } = req.body;
    SendMessage(email, fullName, message, phoneNumber, subject);
    res.status(200).json({ message: 'Email sent successfully' });
});

app.post('/contact/email', (req, res) => {
    const { email } = req.body;
    SendEmail(email);
    res.status(200).json({ message: 'Email sent successfully' });
});

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Server Connected'
    });
});

// Route to get list of videos
app.get('/videos-list', (req, res) => {
    const videoPath = './courses/804/sem1'; // Path to the directory containing videos
    try {
        // Read directory contents synchronously
        const videos = readdirSync(videoPath, { withFileTypes: true })
            .filter(dirent => dirent.isFile()) // Filter out only files
            .map(dirent => dirent.name); // Extract file names
        res.status(200).json({ videos }); // Send array of video file names to frontend
    } catch (err) {
        console.error('Error reading video directory:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3001;
(async () => {
    connectDB().then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)));
})();
