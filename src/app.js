require('dotenv').config();
const fastify = require('fastify');
const autoload = require('@fastify/autoload');
const multipart = require('@fastify/multipart');
const Sentry = require('@sentry/node');
const path = require('path');

const start = async () => {
  const app = fastify({
    logger: true,
    bodyLimit: 1048576 * 20,
  });

  app.register(multipart, {
    attachFieldsToBody: true,
    sharedSchemaId: '#mySharedSchema',
  });

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });

  app.register(autoload, {
    dir: path.join(__dirname, 'routes'),
  });

  app.addHook('onError', (request, reply, error, done) => {
    if (process.env.NODE_ENV !== 'development') {
      Sentry.captureException(error);
    }
    done();
  });

  try {
    const serverPort = process.env.SERVER_PORT || 3000;
    await app.listen({ port: serverPort });
    console.log(`⚡ Fastify listening on port http://localhost:${serverPort}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
