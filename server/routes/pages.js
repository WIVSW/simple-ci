const fs = require('fs');
const path = require('path');

const express = require('express');
const router = express.Router();

const {renderIndexPage, renderBuildPage} = require('../modules/rendering');

const INDEX_PATH = path.resolve(__dirname, `../pages/index.html`);
const BUILD_PATH = path.resolve(__dirname, `../pages/build.html`);

const indexPage = fs.readFileSync(INDEX_PATH, {encoding: 'utf-8'});
const buildPage = fs.readFileSync(BUILD_PATH, {encoding: 'utf-8'});

router.get('/', (req, res) => {
	const content = renderIndexPage();
	const page = indexPage.replace('{{content}}', content);
	res.set('Content-Type', 'text/html');
	res
		.status(200)
		.send(page);
});

router.get('/build/:id', (req, res) => {
	const content = renderBuildPage();
	const page = buildPage.replace('{{content}}', content);
	res.set('Content-Type', 'text/html');
	res
		.status(200)
		.send(page);
});

module.exports = router;
