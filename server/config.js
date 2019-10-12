const DEFAULT_CONFIG = {
	host: 'localhost',
	port: 4500,
};

let config = DEFAULT_CONFIG;

try {
	config = require('../config').server;
} catch (e) {}

module.exports = config;
