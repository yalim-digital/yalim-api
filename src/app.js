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

const activitesRoutes =
require('./modules/activites/activites.routes');


app.use(
    '/api/activites',
    activitesRoutes
);

const participationsRoutes =
require(
    './modules/participations/participations.routes'
);

app.use(
    '/api/participations',
    participationsRoutes
);

const publicationsRoutes =
require(
    './modules/publications/publications.routes'
);

app.use(
    '/api/publications',
    publicationsRoutes
);

const commentairesRoutes =
    require('./modules/commentaires/commentaires.routes');


app.use(
    '/api',
    commentairesRoutes
);

const likesRoutes =
    require('./modules/likes/likes.routes');



app.use(
    '/api',
    likesRoutes
);

const typesCotisationsRoutes =
require('./modules/typesCotisations/typesCotisations.routes');


app.use(
    '/api/types-cotisations',
    typesCotisationsRoutes
);

const cotisationsRoutes =
require('./modules/cotisations/cotisations.routes');


app.use(
    '/api/cotisations',
    cotisationsRoutes
);

const modesPaiementsRoutes =
require('./modules/modesPaiements/modesPaiements.routes');


app.use(
    '/api/modes-paiements',
    modesPaiementsRoutes
);

const paiementsRoutes =
require('./modules/paiements/paiements.routes');


app.use(
    "/api/paiements",
    paiementsRoutes
);

const homeheroRoutes =
require('./modules/homeHero/homeHero.routes');


app.use(
    "/api/home-hero",
    homeheroRoutes
);

const impactsRoutes =
require('./modules/impacts/impacts.routes');


app.use(
    "/api/impacts",
    impactsRoutes
);
const histoireRoutes =
require('./modules/homeHistoire/homeHistoire.routes');


app.use(
    "/api/home-histoire",
    histoireRoutes
);

const timelineRoutes =
require('./modules/timeline/timeline.routes');


app.use(
    "/api/timeline",
    timelineRoutes
);

const IdentitesRoutes =
require('./modules/identites/identites.routes');


app.use(
    "/api/identites",
    IdentitesRoutes
);

const DomainesRoutes =
require('./modules/domaines_actions/domainesActions.routes');


app.use(
    "/api/domaines-actions",
    DomainesRoutes
);

const ProjetsRoutes =
require('./modules/projets/projets.routes');


app.use(
    "/api/projets",
    ProjetsRoutes
);

const PartenairesRoutes =
require('./modules/partenaires/partenaires.routes');


app.use(
    "/api/partenaires",
    PartenairesRoutes
);

const SettingsRoutes =
require('./modules/settings/settings.routes');


app.use(
    "/api/settings",
    SettingsRoutes
);

const NotificationRoutes =
require('./modules/notifications/notification.routes');


app.use(
    "/api/notifications",
    NotificationRoutes
);

const FamilyRoutes =
require('./modules/family/family.routes');


app.use(
    "/api/family",
    FamilyRoutes
);

app.use(errorHandler);

module.exports = app;