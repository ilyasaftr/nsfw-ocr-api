const nsfwHandler = require('../handler/nsfwHandler');

async function routes(fastify, options) {
  const FileBodySchema = {
    type: 'object',
    required: ['file'],
    properties: {
      file: { $ref: '#mySharedSchema' },
    },
  };

  fastify.post('/nsfw/upload', {
    schema: {
      body: FileBodySchema,
    },
    handler: nsfwHandler,
  });
}

module.exports = routes;
