const config = require('./config');

const express = require('express');
const app = express();

const pagesRoute = require('./routes/pages');

app.use(express.json());
app.use(pagesRoute);
app.listen(config.port, config.host, () => {
	console.log(`Master server is running on http://${config.host}:${config.port}/`);
});

module.exports = app;
