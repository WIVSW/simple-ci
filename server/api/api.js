const axios = require('axios');

const fetcher = axios.create({
	timeout: 30 * 1000,
});

/**
 * @param {string} agentUrl
 * @param {Task} task
 * @return {Promise}
 */
const sendTaskToAgent = (agentUrl, task) => {
	console.log('Send task', task.id, 'to', agentUrl);
	return fetcher.post(`${agentUrl}build`, {
		id: task.id,
		url: task.url,
		hash: task.hash,
		command: task.command,
	});
}

module.exports = {
	sendTaskToAgent,
};
