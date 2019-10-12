const {host, port} = require('./config');
const express = require('express');
const app = express();

app.use(express.json());
app.listen(port, host, () => {
	console.log(`Agent server is running on http://${host}:${port}/`);
});

module.exports = app;
