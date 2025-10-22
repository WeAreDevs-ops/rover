
const express = require('express');
const path = require('path');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

const app = express();
const PORT = process.env.PORT || 5000;

// Proxy configuration
const PROXY_URL = 'http://hpbhwlum:ifhjayiy2wek@142.111.48.253:7030';
const proxyAgent = new HttpsProxyAgent(PROXY_URL);

// Serve static files
app.use(express.static(__dirname));

// Serve the verify.html file at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'verify.html'));
});

// Proxy endpoint for iframe content
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const response = await axios.get(targetUrl, {
      httpAgent: proxyAgent,
      httpsAgent: proxyAgent,
      headers: {
        'User-Agent': req.headers['user-agent']
      }
    });

    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).send('Proxy request failed');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
