require('dotenv').config();

const express        = require('express');
const session        = require('express-session');
const { MongoStore } = require('connect-mongo');
const methodOverride = require('method-override');
const cookieParser   = require('cookie-parser');
const helmet         = require('helmet');
const morgan         = require('morgan');
const path           = require('path');

const connectDB = require('./config/database');

const app  = express();
const PORT = process.env.PORT || 3555;

connectDB().catch(err => console.error('DB connect failed:', err.message));

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false, crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
app.use('/uploads', express.static(path.join(__dirname, 'public/images/uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'spyders_fallback',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 60 * 60 * 24
  }),
  cookie: { httpOnly: true, maxAge: 86400000, sameSite: 'lax' }
}));

// ---------- API ----------
app.use('/api/products', require('./routes/api/products'));
app.use('/api/orders',   require('./routes/api/orders'));
app.use('/api/checkout', require('./routes/api/checkout'));
app.use('/api/contact',  require('./routes/api/contact'));
app.use('/api/admin',    require('./routes/api/admin'));

// ---------- HTML pages ----------
app.use('/', require('./routes/pages'));

// ---------- 404 ----------
app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Endpoint not found' });
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// ---------- Errors ----------
app.use((err, req, res, next) => {
  console.error('❌', err.message);
  if (req.path.startsWith('/api/')) return res.status(err.status || 500).json({ error: err.message });
  res.status(500).send('Server error: ' + err.message);
});

// ---------- Start (local only) ----------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('SPYDERS CLOTHER running at http://localhost:' + PORT);
    console.log('ENV: ' + (process.env.NODE_ENV || 'development'));
  });
}

// ---------- Export for Vercel serverless ----------
module.exports = app;

