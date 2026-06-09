const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const errorHandler =
require('./middlewares/error.middleware');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(helmet());

app.use(compression());

app.use(morgan('dev'));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

const authRoutes =
require('./modules/auth/auth.routes');

app.use(
    '/api/auth',
    authRoutes
);

app.use(errorHandler);

module.exports = app;