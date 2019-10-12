const fs = require('fs');
const path = require('path');

const express = require('express');
const router = express.Router();

const Task = require('../models/task');

router.get('/run', (req, res) => {
	const {url, hash, command} = req.query;

	const task = new Task(url, hash, command);

	if (!task.isValid()) {
		res
			.status(400)
			.send('Произошла ошибка! Проверьте введенные данные.');
	}

	res
		.status(200)
		.send('Ok');
});

module.exports = router;
