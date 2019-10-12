const express = require('express');
const router = express.Router();

const deps = {
	engine: null,
};

router.get('/run', async (req, res) => {
	const {url, hash, command} = req.query;

	try {
		await deps.engine.addTask(url, hash, command);
		res.redirect('/');
	} catch (e) {
		res
			.status(400)
			.send('Произошла ошибка! Проверьте введенные данные.');
	}
});

/**
 * @param {Engine} engine
 * @return {Router}
 */
module.exports = ({engine}) => {
	deps.engine = engine;
	return router;
};
