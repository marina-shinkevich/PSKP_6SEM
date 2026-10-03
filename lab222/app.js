const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = 3000;

const options = {
    key: fs.readFileSync('resource.key'),
    cert: fs.readFileSync('resource.crt')
};

app.get('/', (req, res) => {
    res.send('<h1>HTTPS Сервер работает!</h1>');
});

https.createServer(options, app).listen(PORT, () => {
    console.log('Сервер запущен: https://LAB22-SMD:3000');
});