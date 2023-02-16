import pino from 'pino';
import dotenv from 'dotenv';

dotenv.config();

//config based in enviroment (dev, prod or qa)
export default pino ({
    enabled: true,
    level: process.env.NODE_ENV === 'dev' 
        ? 'debug' : 'info'
});