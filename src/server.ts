import express from 'express';
import authRoutes from './routes/authRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import habitRoutes from './routes/habitRoutes.ts';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorhandler } from './middleware/errorHandler.ts';



const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
    res.status(200).json({ message: "server is running" })
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);

app.use(errorhandler);

export { app };

export default app;