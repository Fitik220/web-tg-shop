const TELEGRAM_API = 'https://api.telegram.org';

async function getImage(req, res, next) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      return res.status(503).json({ message: 'Telegram bot is not configured' });
    }

    const { fileId } = req.params;

    const fileInfoResponse = await fetch(`${TELEGRAM_API}/bot${botToken}/getFile?file_id=${fileId}`);
    const fileInfo = await fileInfoResponse.json();

    if (!fileInfo.ok) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const fileUrl = `${TELEGRAM_API}/file/bot${botToken}/${fileInfo.result.file_path}`;
    const imageResponse = await fetch(fileUrl);

    res.set('Content-Type', imageResponse.headers.get('content-type') || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');

    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    res.send(buffer);
  } catch (error) {
    next(error);
  }
}

module.exports = { getImage };
