import express from 'express';
import cors from 'cors';
import router from './routes/routes.js';
import DBConnection from './database/db.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
DBConnection();
const __dirname = path.resolve();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', router);
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  })
  
const PORT = 8000;

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));