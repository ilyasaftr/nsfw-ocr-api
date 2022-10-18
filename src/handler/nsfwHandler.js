const tf = require('@tensorflow/tfjs-node');
const nsfwjs = require('nsfwjs');

async function nsfwHandler(request, reply) {
  tf.enableProdMode();
  const mimeType = request.body.file.mimetype;
  if (mimeType !== 'image/jpeg' && mimeType !== 'image/png') {
    reply
      .code(400)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ status: false, data: 'Image not valid!' });
  }

  const model = await nsfwjs.load();
  const imageBuffer = await request.body.file.toBuffer();

  const tfImage = tf.node.decodeImage(imageBuffer, 3);
  try {
    const prediction = await model.classify(tfImage);
    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ status: true, data: prediction });
  } catch (error) {
    reply
      .code(400)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ status: false, data: 'Internal Server Error!' });
  } finally {
    tfImage.dispose();
  }
}

module.exports = nsfwHandler;
