const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');

require('dotenv').config();

const userRoute = require('./routes/user');
const sauceRoute = require('./routes/sauce')

const app = express();

mongoose.connect(process.env.DB_PATH,
    { useNewUrlParser: true,
      useUnifiedTopology: true})
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.DB_HOST);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use(helmet());


app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoute);
app.use('/api/auth', userRoute);


module.exports = app;