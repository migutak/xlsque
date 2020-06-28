#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var dbConfig = require('./dbconfig.js');
var cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.post('/send-to-que', function (req, res) {
    amqp.connect(dbConfig.rabbit, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'xlsupload';
            var msg = req.body;
            channel.assertQueue(queue, {
                durable: false
            });

            var i, j, temparray, chunk = 20;
            for (i = 0, j = msg.length; i < j; i += chunk) {
                temparray = msg.slice(i, i + chunk);
                // do whatever
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(temparray)));

                console.log(" [x] Sent %s", JSON.stringify(msg));
            }
            res.json({
                result: " [x] msg sent to que"
            })
        });
        /*setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);*/

    });

});

app.listen(1020, function () {
    console.log('xls send running at 1020');
});
