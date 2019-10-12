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

if (process.env.SERVER_URL) {
	envConfig.serverUrl = process.env.SERVER_URL;
}

let config = {};

try {
	const serverConfig = require('../config').server;
	config = require('../config').agent;
	config.serverUrl = `http://${serverConfig.host}:${serverConfig.port}`;
} catch (e) {}

const argsConfig = {};

if (argv.host) {
	argsConfig.host = argv.host;
}

if (argv.port) {
	argsConfig.port = argv.port;
}

if (argv.serverUrl) {
	argsConfig.serverUrl = argv.serverUrl;
}

module.exports = Object.assign(
	{},
	DEFAULT_CONFIG,
	config,
	envConfig,
	argsConfig
);
