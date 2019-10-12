const express = require('express');
const router = express.Router();
const Agent = require('../models/agent');

const allowCors = require('../middleware/allow-cors');

const deps = {
	engine: null,
};

router.get('/run', async (req, res) => {
	const {url, hash, command} = req.query;

	try {
		deps.engine.addTask(url, hash, command);
		res.redirect('/');
	} catch (e) {
		res
			.status(400)
			.send('Произошла ошибка! Проверьте введенные данные.');
	}
});

router.post('/notify_agent', allowCors, async (req, res) => {
	const {host, port} = req.body;

	deps.engine.registerAgent(host, port);
	res
		.status(200)
		.send('Ok');
});

router.post('/notify_build_result', allowCors, async (req, res) => {
	const {id, exitCode, stdout, stderr} = req.body;
	const host = req.headers['x-host'];
	const port = req.headers['x-port'];

	if (!(host && port)) {
		res
			.status(401)
			.send('You are not authorized');
		return;
	}

	deps.engine.receiveData(
		Agent.createUrl(host, port),
		id,
		exitCode,
		stdout,
		stderr
	);

	res
		.status(200)
		.send('Ok');
});

/**
 * @param {Engine} engine
 * @return {Router}
 */
module.exports = ({engine}) => {
	deps.engine = engine;
	return router;
};
