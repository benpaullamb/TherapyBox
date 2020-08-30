const express = require('express');
const fs = require('fs');
const got = require('got');
const RSSParser = require('rss-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { Readable } = require('stream');
const Grid = require('gridfs-stream');
const Jimp = require('jimp');
const User = require('./user-schema');
const {processSportData, getUniqueClotheCounts} = require('./data-process');

const router = express.Router();
const rssParser = new RSSParser();
const upload = multer();

const db = mongoose.connection;
let gridFS;
db.once('open', () => {
    gridFS = Grid(db.db, mongoose.mongo);
});

const sportCSV = fs.readFileSync(__dirname + '\\..\\sport-data.csv', 'utf8');
let sportData; 
(async function() {
    sportData = await processSportData(sportCSV);
})();

// Weather
router.get('/weather', async (req, res) => {
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

// News
router.get('/news', async (req, res) => {
    const feed = await rssParser.parseURL('http://feeds.bbci.co.uk/news/rss.xml');
    const news = {
        title: feed.items[0].title,
        snippet: feed.items[0].contentSnippet,
        content: feed.items[0].content
    };
    res.json(news);
});

router.get('/news/all', async (req, res) => {
    const feed = await rssParser.parseURL('http://feeds.bbci.co.uk/news/rss.xml');
    res.json(feed);
});

// Sports
router.get('/sport/random', (req, res) => {
    const randomIndex = Math.floor(Math.random() * (sportData.length - 1)) + 1;
    res.json(sportData[randomIndex]);
});

router.get('/sport/beaten-teams', (req, res) => {
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

router.post('/tasks/save', async (req, res) => {
    if(!req.user) return res.json({success: false});
    const tasks = req.body;

    const user = await User.findOne({ username: req.user.username });
    if(!user) return res.json({success: false});
    user.tasks = tasks;

    const saveRes = await user.save();
    if(!saveRes) return res.json({success: false});
    res.json({success: true});
});

router.get('/tasks', async (req, res) => {
    if(!req.user) return res.json({success: false, message: 'No authenticated user'});

    const user = await User.findOne({ username: req.user.username });
    if(!user) return res.json({success: false, message: 'No user in db'});

    res.json(user.tasks);
});

// Clothes/warmer
router.get('/clothes', async (req, res) => {
    const {body} = await got(`https://therapy-box.co.uk/hackathon/clothing-api.php?username=swapnil`, {
        responseType: 'json'
    });

    const uniqueClothes = getUniqueClotheCounts(body.payload);

    res.json(uniqueClothes);
});

// Photos
router.post('/photo/upload', upload.single('photo'), async (req, res) => {
    const user = await User.findOne({ username: req.user.username });

    const image = await Jimp.read(req.file.buffer);
    image.resize(280, 280);
    const buffer = await image.getBufferAsync(Jimp.AUTO);

    const writable = gridFS.createWriteStream({
        filename: req.file.originalname,
        mode: 'w',
        content_type: req.file.mimetype
    });

    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);

    writable.on('close', async file => {
        user.photoIds.push(file._id);
        await user.save();
        res.sendStatus(200);
    });

    readable.pipe(writable);
});

router.get('/photo', async (req, res) => {
    const user = await User.findOne({ username: req.user.username });

    if(user.photoIds.length === 0) return res.sendStatus(404);

    const image = await loadImage(user.photoIds[req.query.i]);

    res.send(image);
});

router.get('/photo/count', async (req, res) => {
    if(!req.user) return res.sendStatus(404);
    
    const user = await User.findOne({ username: req.user.username });
    res.json({
        count: user.photoIds.length
    });
});

async function loadImage(photoId) {
    return new Promise((res, rej) => {
        const readable = gridFS.createReadStream({
            _id: photoId
        });
    
        const bufferArray = [];
        readable.on('data', data => bufferArray.push(data));
        readable.on('end', async () => {
            const buffer = Buffer.concat(bufferArray);
            return res(buffer);
        });
        readable.on('error', err => {
            return rej(err);
        });
    });
}

module.exports = router;