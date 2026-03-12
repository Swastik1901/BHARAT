import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import forgeRouter from './routes/forge.js';
import chatRouter from './routes/chat.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/forge', forgeRouter);
app.use('/v1', chatRouter);

app.get('/health', (req, res) => {
    res.json({ status: "ok" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`PersonaForge server running on port ${PORT}`);
});
