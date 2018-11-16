const express = require('express');
const morgan = require('morgan');
const redis = require('redis');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require("body-parser");
const flash = require('connect-flash');
const RedisStore = require('connect-redis')(session);
const port = 3444;
const client = redis.createClient();
const app = express();
const ejs = require('ejs');
var bcrypt = require('bcrypt-nodejs')

//Setting up session with Redis
app.use(session({
    store: new RedisStore({
        host: 'localhost', port: 6379, client: client, ttl: 260
    }),
    secret: 'bankingLedger',
    resave: false,
    saveUninitialized: false
}));

//setup flash messages
app.use(flash());

//bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(morgan('dev'));
app.use(cookieParser());

//set view engine
app.set('view engine', 'ejs');

//set client side path
app.use(express.static('client'));

//set routes
require('./server/routes')(app,client,bcrypt);

//start redis
client.on('connect', function () {
    console.log('redis is connected');
});

//listen via http port
app.listen(port, function (err) {
    if (err)
        return console.log('Error Occurred');
    console.log('Serving port number: '+ port);
});