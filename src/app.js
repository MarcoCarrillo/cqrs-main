"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var typeorm_1 = require("typeorm");
var amqp = require("amqplib/callback_api");
(0, typeorm_1.createConnection)().then(function (db) {
    amqp.connect('amqps://rsbozcyr:XDoJ_MDnkPqvTlJ0WJQdMPTj2FajyVQ-@toad.rmq.cloudamqp.com/rsbozcyr', function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            var app = express();
            app.use(cors());
            app.use(express.json());
            var PORT = 8001;
            console.log("Listening to port: ".concat(PORT));
            app.listen(PORT);
        });
    });
});
