require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const apiRouter = require('./backend/api');
const User = require('./backend/user-schema');

const bcryptSaltRounds = 10;

// Database
mongoose.connect('mongodb://localhost/therapybox', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', () => {
    console.log('Db connection error');
});

// Express config
const app = express();
const port = process.env.PORT;
app.use(express.static('public'));
app.use(express.json());
app.use(session({
    secret: 'therapybox',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hour session
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport
passport.use(new LocalStrategy(
    async (username, password, done) => {
        const user = await User.findOne({ username });
        if(!user) {
            return done(null, false, { message: 'Incorrect username' });
        }

        const validPass = await bcrypt.compare(password, user.passHash);
        if(!validPass) {
            return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
    }
));

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findOne({ username: id });
    if(!user) return done('No user');
    done(null, user);
});

// Login
app.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ success: true });
});

app.get('/logout', (req, res, next) => {
    req.logout();
    next();
});

app.get('/auth', (req, res) => {
    if(req.user) return res.json({ success: true });
    res.json({ success: false });
});

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    
    const existingUser = await User.findOne({ username });
    if(existingUser) return res.json({ success: false });

    const passHash = await bcrypt.hash(password, bcryptSaltRounds);
    const user = new User({
        username,
        passHash,
        email
    });

    const savedUser = await user.save();
    if(!savedUser) return res.json({ success: false });
    return res.json({ success: true });
});

app.use('/api', apiRouter);

// Pages
app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Node Express server started at http://localhost:${port}`);
});