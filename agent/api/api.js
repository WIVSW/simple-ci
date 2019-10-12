const axios = require('axios');

const deps = {
	fetcher: null,
	host: null,
	port: null,
};

const register = () => deps.fetcher.post('/notify_agent', {
	host: deps.host,
	post: deps.port,
});

const sendResult = ({id, exitCode, stdout, stderr}) => deps.fetcher.post('/notify_build_result', {
	id,
	exitCode,
	stdout,
	stderr,
});

module.exports = ({serverUrl, host, port}) => {
	deps.host = host;
	deps.port = port;
	deps.fetcher = axios.create({
		baseURL: serverUrl,
		timeout: 30 * 1000,
		headers: {
			'x-host': host,
			'x-port': port,
		},
	});
	return {
		register,
		sendResult,
	};
};
