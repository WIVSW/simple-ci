const argv = require('yargs').parse();

const DEFAULT_CONFIG = {
	host: 'localhost',
	port: 4600,
};

const envConfig = {};

if (process.env.HOST) {
	envConfig.host = process.env.HOST;
}

if (process.env.PORT) {
	envConfig.port = process.env.PORT;
}

let config = {};

try {
	config = require('../config').agent;
} catch (e) {}

const argsConfig = {};

if (argv.host) {
	argsConfig.host = argv.host;
}

if (argv.port) {
	argsConfig.port = argv.port;
}

module.exports = Object.assign(
	{},
	DEFAULT_CONFIG,
	config,
	envConfig,
	argsConfig
);
