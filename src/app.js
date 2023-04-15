"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var typeorm_1 = require("typeorm");
(0, typeorm_1.createConnection)().then(function (db) {
    var app = express();
    app.use(cors());
    app.use(express.json());
    var PORT = 8001;
    console.log("Listening to port: ".concat(PORT));
    app.listen(PORT);
});
