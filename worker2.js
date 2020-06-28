#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const axios = require('axios');
var dbConfig = require('./dbconfig.js');

amqp.connect(dbConfig.rabbit, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'xlsupload';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*worker2] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(" [*worker2] Received");
            console.log(JSON.parse(msg.content));
            axios.post('http://127.0.0.1:8000/api/notehis', JSON.parse(msg.content))
                .then(function (response) {
                    console.log(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }, {
            noAck: true
        });
    });
});