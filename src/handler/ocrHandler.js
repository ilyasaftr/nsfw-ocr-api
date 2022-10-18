const { createWorker, createScheduler } = require('tesseract.js');

async function ocrHandler(request, reply) {
  const mimeType = request.body.file.mimetype;
  if (mimeType !== 'image/jpeg' && mimeType !== 'image/png') {
    reply
      .code(400)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ status: false, data: 'Image not valid!' });
  }
  const scheduler = createScheduler();
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  scheduler.addWorker(worker);
  const imageBuffer = await request.body.file.toBuffer();
  try {
    const { data: { text } } = await scheduler.addJob('recognize', imageBuffer);
    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ status: true, data: text });
  } catch (error) {
    reply
      .code(400)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ status: false, data: 'Internal Server Error!' });
  } finally {
    await scheduler.terminate();
  }
}

module.exports = ocrHandler;
