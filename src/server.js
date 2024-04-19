import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url'; 
import path from 'path';  // Add this line

// Configure dotenv to read .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;  // Default to 3000 if PORT isn't set in .env
const API_BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1';
const API_PORT = process.env.API_PORT || 5100;

// Path setup for ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Enable all CORS requests
app.use(cors());

// Serve static files from the public directory and src directory
app.use(express.static('public'));
app.use('/src', express.static(path.resolve(__dirname, '../src')));

// Send configuration to the client
app.get('/config', (req, res) => {
    res.json({ apiBaseUrl: `${API_BASE_URL}:${API_PORT}/api` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
