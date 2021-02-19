import express from 'express';
import bodyParser from 'body-parser';
import routes from '../src/routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mount all routes on /api path
app.use('/api', routes);
app.use((err, req, res, next) => {
    res.status(err.status).json({
        status: err.status,
        message: err.message,
    });
});

export default app;
