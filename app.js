import express from 'express';
import cookieParser from 'cookie-parser';
import purchaseRouter from './src/code/router.js';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import swaggerRouter from './src/doc/swagger.js';

dotenv.config();

//config
const result = dotenvExpand.expand(
    {
        ignoreProcessEnv: false,
        parsed: process.env
    }
);  

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//generic route to all purchase routes (get and post)
app.use('/purchase', purchaseRouter);
app.use('/api-docs', swaggerRouter);

export default app;
