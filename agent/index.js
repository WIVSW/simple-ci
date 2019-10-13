const {host, port, serverUrl} = require('./config');
const express = require('express');
const app = express();
const Task = require('../common/models/task');
const allowCors = require('../common/middleware/allow-cors');

if (!serverUrl) {
	console.error('The server url is not specified');
	process.exit(1);
}

const api = require('./api/api')({serverUrl, host, port});
const Engine = require('./modules/engine');
const engine = new Engine(api);

app.use(express.json());

app.post('/build', allowCors, (req, res) => {
	const {id, url, hash, command} = req.body;
	const task = new Task(id, url, hash, command);
	if (engine.addTask(task)) {
		res
			.status(200)
			.send('Ok');
	} else {
		res
			.status(400)
			.send('Too much');
	}
});

app.listen(port, host, async () => {
	console.log(`Agent server is running on http://${host}:${port}/`);
	api
		.register()
		.catch(() => {
			console.error('Unable to register on master server. SHUTDOWN.');
			process.exit(1);
		});
});

module.exports = app;
