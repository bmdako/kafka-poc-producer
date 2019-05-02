/*jshint node: true */
'use strict';

const kafka = require('kafka-node');

const KAFKA_HOST = process.env.KAFKA_HOST;

const client = new kafka.KafkaClient({
  kafkaHost: KAFKA_HOST
});

client.on("ready", function() {
  console.log("Producer connected");
});

client.on("error", function(err) {
  console.error('Producer connection error')
  console.error(err);
});

const producer = new kafka.Producer(client);

producer.on('error', function (err) {
  console.error('Producer error')
  console.error(err);
});

producer.on('ready', function () {
  console.log('Producer ready');
});

producer.on('ready', run);
 
function run() {
  producer.send([
    { topic: 'test', messages: 'hej fra node', partition: 0 },
    { topic: 'test2', messages: 'hej fra node til test 2', partition: 0 }
  ], function (err, data) {
      console.log(data);
  });
}
