const config = require('./config');

const express = require('express');
const app = express();

const Engine = require('./modules/engine');

const engine = new Engine({});

const pagesRoute = require('./routes/pages')({engine});
const actionsRoute = require('./routes/actions')({engine});

app.use(express.json());
app.use(pagesRoute);
app.use(actionsRoute);
app.listen(config.port, config.host, () => {
	console.log(`Master server is running on http://${config.host}:${config.port}/`);
});

module.exports = app;
