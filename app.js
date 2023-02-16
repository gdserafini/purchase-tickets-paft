import express from 'express';
import cookieParser from 'cookie-parser';
import purchaseRouter from './src/code/router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//generic route to all purchase routes (get and post)
app.use('/purchase', purchaseRouter);

export default app;
