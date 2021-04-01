import express from 'express';
import bodyParser from 'body-parser';
import routes from '../src/routes/index.js';
import cors from 'cors';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
// mount all routes on /api path
app.use('/api', routes);
app.use((err, req, res, next) => {
    res.locals.error = err;
    const status = err.status || 500;
    res.status(status).json({
        status: err.status,
        message: err.message,
    });
});

export default app;
