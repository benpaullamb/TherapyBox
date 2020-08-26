require('dotenv').config();
const fs = require('fs');
const express = require('express');
const got = require('got');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const RSSParser = require('rss-parser');
const csvParse = require('csv-parse');

// Other config
const rssParser = new RSSParser();
const bcryptSaltRounds = 10;

// Sports data
const sportCSV = fs.readFileSync(__dirname + '/sport-data.csv', 'utf8');
let sportData = [];
csvParse(sportCSV, (err, output) => {
    if(err) return console.log('Failed to parse sport data');
    sportData = output.map(record => {
        return {
            date: record[1],
            homeTeam: record[2],
            awayTeam: record[3],
            homeGoals: Number(record[4]),
            awayGoals: Number(record[5]),
            result: record[6]
        };
    });
});

// Database
mongoose.connect('mongodb://localhost/therapybox', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', () => {
    console.log('Db connection error');
});
db.once('open', () => {
    console.log('Db connected');
});

const userSchema = new mongoose.Schema({
    username: String,
    passHash: String,
    email: String
});
const User = mongoose.model('User', userSchema);

// Express config
const app = express();
const port = 3000;
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

// Weather
app.get('/api/weather', async (req, res) => {
    const { lat, lon } = req.query;
    const { body: openWeather } = await got(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API}&units=metric`, {
        responseType: 'json'
    });
    
    const weather = {
        temp: Math.round(openWeather.main.temp),
        city: openWeather.name,
        condition: openWeather.weather[0].main
    };

    res.json(weather);
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

// News
app.get('/api/news', async (req, res) => {
    const feed = await rssParser.parseURL('http://feeds.bbci.co.uk/news/rss.xml');
    const news = {
        title: feed.items[0].title,
        snippet: feed.items[0].contentSnippet,
        content: feed.items[0].content
    };
    res.json(news);
});

app.get('/api/news/all', async (req, res) => {
    const feed = await rssParser.parseURL('http://feeds.bbci.co.uk/news/rss.xml');
    res.json(feed);
});

// Sports
app.get('/api/sport/random', (req, res) => {
    const randomIndex = Math.floor(Math.random() * (sportData.length - 1)) + 1;
    res.json(sportData[randomIndex]);
});

app.get('/api/sport/beaten-teams', (req, res) => {
    const team = req.query.team.toLowerCase().trim();

    const beatenTeams = [];

    sportData.forEach(match => {
        if(match.homeTeam.toLowerCase() === team && match.result === 'H') {
            if(!beatenTeams.includes(match.awayTeam)) beatenTeams.push(match.awayTeam);
        } 
        else if(match.awayTeam.toLowerCase() === team && match.result === 'A') {
            if(!beatenTeams.includes(match.homeTeam)) beatenTeams.push(match.homeTeam);
        }
    });

    res.json(beatenTeams);
});

// Pages
app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Node Express server started at http://localhost:${port}`);
});