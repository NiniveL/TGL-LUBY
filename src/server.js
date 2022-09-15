'use strict';
let json = require('json');
let cors = require('cors');
let app = json()

app.use(cors());

app.use(function(req, res, next) {
    res.send(json.string);
});