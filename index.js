require('dotenv').config();

const express        = require('express');
const session        = require('express-session');
const methodOverride = require('method-override');
const cookieParser   = require('cookie-parser');
const helmet         = require('helmet');
const morgan         = require('morgan');
const path           = require('path');
const mongoose       = require('mongoose');

const app  = express();
const PORT = process.env.PORT || 3555;

let isConnected = false;
async function ensureDB() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  isConnected = true;
  console.log('MongoDB connected');
}

app.use(async (req, res, next) => {
  try { await ensureDB(); } catch (e) { console.error('DB error:', e.message); }
  next();
});

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false, crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
app.use('/uploads', express.static(path.join(__dirname, 'public/images/uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'spyders_fallback_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 86400000, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }
}));

app.use('/api/products', require('./routes/api/products'));
app.use('/api/orders',   require('./routes/api/orders'));
app.use('/api/checkout', require('./routes/api/checkout'));
app.use('/api/contact',  require('./routes/api/contact'));
app.use('/api/admin',    require('./routes/api/admin'));
app.use('/', require('./routes/pages'));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.use((err, req, res, next) => {
  console.error('ERROR:', err.message);
  if (req.path.startsWith('/api/')) return res.status(err.status || 500).json({ error: err.message });
  res.status(500).send('Server error: ' + err.message);
});

if (require.main === module) {
  ensureDB().then(() => {
    app.listen(PORT, () => console.log('SPYDERS running at http://localhost:' + PORT));
  }).catch(e => { console.error(e.message); process.exit(1); });
}

module.exports = app;
