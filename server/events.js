'use strict';

const Kafka = require('./kafka.js');
const Boom = require('boom');

const KAFKA_INGRESS_TOPIC = process.env.KAFKA_INGRESS_TOPIC;

if(!KAFKA_INGRESS_TOPIC) {
  console.error('Kafka ingress topic missing');
}

module.exports = {
  name: 'events',
  version: '1.0.0',
  register: async (server, options) => {

    server.route({
      method: 'POST',
      path: '/',
      options: {
        auth: 'bpc',
        payload: {
          parse: false
        }
      },
      handler: async (request, h) => {

        const payloads = [
          {
            topic: KAFKA_INGRESS_TOPIC,
            messages: request.payload,
            partition: 0
          }
        ];

        if(!KAFKA_INGRESS_TOPIC) {
          console.error('Kafka ingress topic missing');
          return;
        }

        return new Promise((resolve, reject) => {
          try {
            Kafka.send(payloads, function (err, data) {
              if(err) {
                console.error(err);
                reject(Boom.badRequest());
              } else {
                resolve('OK');
              }
            });
            // Just in case of any unknow exceptions
          } catch (ex) {
            console.error(ex);
            reject(Boom.badRequest());
          }
        });
      }
    });
  }
};
