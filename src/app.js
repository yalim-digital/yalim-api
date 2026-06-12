const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const errorHandler =
require('./middlewares/error.middleware');

const path =
    require('path');



const app = express();

app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    }
  })
);

const allowedOrigins = process.env.FRONTEND_URL.split(",");

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

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