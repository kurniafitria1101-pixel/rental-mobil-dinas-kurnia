import express from 'express';
import userRoutes from './routes/userRoutes.mjs';

const app = express();
const port = 3000;

app.use(express.json());

// Route utama
app.get('/', (req, res) => {
    res.send('Selamat datang di API Rental Mobil Dinas');
});

// Route users
app.use('/api/users', userRoutes);

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});