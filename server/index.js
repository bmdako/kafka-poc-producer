/*jshint node: true */
'use strict';

const Kafka = require('./kafka.js');
const Hapi = require('hapi');
const Events = require('./events.js')
const Scheme = require('./scheme.js')


process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

server.register(Scheme);
server.register(Events, { routes: { prefix: '/events' } });

Kafka.on('ready', async () => {
  await server.start();
  console.log('Server running on %s', server.info.uri);
});