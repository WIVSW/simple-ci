const DEFAULT_CONFIG = {
	host: 'localhost',
	port: 4500,
};

let config = DEFAULT_CONFIG;

try {
	config = require('../config');
} catch (e) {}

const HOST = config.server.host;
const PORT = config.server.port;

const express = require('express');
const app = express();

app.use(express.json());
app.listen(PORT, HOST, () => {
	console.log(`Master server is running on http://${HOST}:${PORT}/`);
});

module.exports = app;
