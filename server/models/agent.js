/**
 */
class Agent {
	/**
	 * @param {string} host
	 * @param {string} port
	 */
	constructor(host, port) {
		/**
		 * @type {string}
		 */
		this.host = host;

		/**
		 * @type {string}
		 */
		this.port = port;

		/**
		 * Array of tasks ids
		 * @type {Array<number>}
		 */
		this.tasks = [];
	}

	/**
	 * @param {number} id
	 */
	startTask(id) {
		this.tasks.push(id);
	}

	/**
	 * @param {number} id
	 */
	stopTask(id) {
		const index = this.tasks.indexOf(id);
		this.tasks.splice(index, 1);
	}

	/**
	 * @return {string}
	 */
	get url() {
		return Agent.createUrl(this.host, this.port);
	}

	/**
	 * @param {string} host
	 * @param {string} port
	 * @return {string}
	 */
	static createUrl(host, port) {
		return `http://${host}:${port}/`;
	}
}

module.exports = Agent;
