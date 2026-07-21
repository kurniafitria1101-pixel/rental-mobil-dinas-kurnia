import express from 'express';
import dotenv from 'dotenv';

dotenv.config();


import userRoutes from './routes/userRoutes.mjs';
import mobilRoutes from './routes/mobilRoutes.mjs';
import sopirRoutes from './routes/sopirRoutes.mjs';
import pengajuanRoutes from './routes/pengajuanRoutes.mjs';
import approvalRoutes from './routes/approvalRoutes.mjs';
import authRoutes from './routes/authRoutes.mjs';
import dashboardRoutes from "./routes/dashboardRoutes.mjs";
import laporanRoutes from "./routes/laporanRoutes.mjs";

const app = express();
const port = 3000;

app.use(express.json());

// Route utama
app.get('/', (req, res) => {
    res.send('Selamat datang di API Rental Mobil Dinas');
});

// Route users
app.use('/api/users', userRoutes);
// Route mobil
app.use('/api/mobil', mobilRoutes);
// Route sopir
app.use('/api/sopir', sopirRoutes);
// Route pengajuan
app.use('/api/pengajuan', pengajuanRoutes);
// Route approval
app.use('/api/approval', approvalRoutes);
// Route login
app.use('/api/auth', authRoutes);
//dahsboard
app.use('/api/dashboard', dashboardRoutes);
// bagian membuat laporan seluruhnya
app.use("/api/laporan", laporanRoutes);


app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});