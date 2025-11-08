import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connectdb.js';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/services_routes.js';
import fetchmechanic from './routes/fetchMechanic.js';
import sendotp from './routes/sendOTP.js';
const app = express();
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api/auth',authRoutes);
app.use('/api/auth' ,serviceRoutes);
app.use('/api/mechanic',fetchmechanic);
app.use('/api/auth',sendotp);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});