const ocrHandler = require('../handler/ocrHandler');

async function routes(fastify, options) {
  const FileBodySchema = {
    type: 'object',
    required: ['file'],
    properties: {
      file: { $ref: '#mySharedSchema' },
    },
  };

  fastify.post('/ocr/upload', {
    schema: {
      body: FileBodySchema,
    },
    handler: ocrHandler,
  });
}

module.exports = routes;
