/*jshint node: true */
'use strict';

const Boom = require('boom');
const BpcClient = require('bpc_client');

BpcClient.events.on('ready', async () => {
  console.log('Connected to BPC');
});

const BPC_APP_ID = process.env.BPC_APP_ID;
const BPC_APP_KEY = process.env.BPC_APP_KEY;
const BPC_URL = process.env.BPC_URL;


const scheme = function (server, options) {

  return {

    authenticate: async function (request, h) {

      const bpc = h.bpc;

      const artifacts = await bpc.request({
        path: '/validate/credentials',
        method: 'POST',
        payload: {
          method: request.method,
          url: request.url.href,
          authorization: request.headers.authorization
        }
      });

      return h.authenticated({ credentials: artifacts });

    }
  };
};


module.exports = {
  name: 'scheme',
  version: '1.0.0',
  register(server, options) {
      BpcClient.connect({ id: BPC_APP_ID, key: BPC_APP_KEY, algorithm: 'sha256' }, BPC_URL);
      server.auth.scheme('bpc', scheme);
      server.auth.strategy('bpc', 'bpc');
      server.decorate('toolkit', 'bpc', BpcClient);
  }
};