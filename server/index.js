const config = require('./config');

const express = require('express');
const app = express();

app.use(express.json());
app.listen(config.port, config.host, () => {
	console.log(`Master server is running on http://${config.host}:${config.port}/`);
});

module.exports = app;
