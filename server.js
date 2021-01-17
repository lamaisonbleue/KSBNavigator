const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;




app.use(express.static(__dirname + '/dist/ksbnavigator'));

app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));


const server = http.createServer(app);
server.listen(port, () => console.log(`App running on: http://localhost:${port}`));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});


