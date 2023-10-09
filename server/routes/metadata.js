import express from 'express';
import bodyParser from 'body-parser';
import geoip from 'geoip-lite';

const router = express.Router();
const jsonParser = bodyParser.json();

router.use((req, res, next) => {
  const ip = req.header('x-forwarded-for') || req.remoteAddress;
  req.clientIP = ip;
  next();
});

router.post('/', jsonParser, async (req, res) => {
  try {
    const clientIP = req.clientIP;

    const geo = geoip.lookup(clientIP);

    const { message } = req.body;

    console.log(`User Info -- IP-Address: ${clientIP}, Location: ${geo.city}, ${geo.country}, Metadata: ${message}`);

    res.status(200).json({ message: 'Received Metadata' });
  } catch (error) {
    console.error('Error processing metadata:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router
