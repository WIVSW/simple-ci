const fs = require('fs');
const path = require('path');

const express = require('express');
const router = express.Router();

const {renderIndexPage, renderBuildPage} = require('../modules/rendering');

const INDEX_PATH = path.resolve(__dirname, `../pages/index.html`);
const BUILD_PATH = path.resolve(__dirname, `../pages/build.html`);

const indexPage = fs.readFileSync(INDEX_PATH, {encoding: 'utf-8'});
const buildPage = fs.readFileSync(BUILD_PATH, {encoding: 'utf-8'});

const deps = {
	engine: null,
};

router.get('/', (req, res) => {
	const tasks = deps.engine.getTasks();
	const content = renderIndexPage(tasks);
	const page = indexPage.replace('{{content}}', content);
	res.set('Content-Type', 'text/html');
	res
		.status(200)
		.send(page);
});

router.get('/build/:id', (req, res) => {
	const {id} = req.params;
	const task = deps.engine.getTaskById(id);

	if (!task) {
		res
			.status(404)
			.send('Сборка не найдена.');
		return;
	}

	const content = renderBuildPage(task);
	const page = buildPage.replace('{{content}}', content);
	res.set('Content-Type', 'text/html');
	res
		.status(200)
		.send(page);
});

/**
 * @param {Engine} engine
 * @return {Router}
 */
module.exports = ({engine}) => {
	deps.engine = engine;
	return router;
};
