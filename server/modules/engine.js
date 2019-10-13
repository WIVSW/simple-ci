const Task = require('../../common/models/task');
const Agent = require('../models/agent');

/**
 */
class Engine {
	/**
	 * @param {Object} api
	 */
	constructor(api) {
		/**
		 * @const {number}
		 */
		this.MAX_PENDING_INTERVAL = 60 * 1000;

		/**
		 * @type {Object}
		 * @private
		 */
		this._api = api;

		/**
		 * @type {number}
		 * @private
		 */
		this._lastId = 0;

		/**
		 * @type {Array<Task>}
		 * @private
		 */
		this._queue = [];

		/**
		 * @type {Array<Task>}
		 * @private
		 */
		this._pendings = [];

		/**
		 * @type {Array}
		 * @private
		 */
		this._done = [];

		/**
		 * @type {Object<number, Task>}
		 * @private
		 */
		this._mapIdToTask = {};

		/**
		 * @type {Object<string, Agent>}
		 * @private
		 */
		this._agents = {};

		setInterval(() => this._recyclePendings(), this.MAX_PENDING_INTERVAL);
	}

	/**
	 * @param {string} host
	 * @param {string} port
	 */
	registerAgent(host, port) {
		const agent = new Agent(host, port);
		this._agents[agent.url] = agent;
		console.log('Register new agent', agent.url);
		this._recycle();
	}

	/**
	 * @param {number|string} id
	 * @return {?Task}
	 */
	getTaskById(id) {
		return this._mapIdToTask[id] || null;
	}

	/**
	 * @return {Array<Task>}
	 */
	getTasks() {
		return Object
			.values(this._mapIdToTask)
			.sort((a, b) => b.timestamp - a.timestamp);
	}

	/**
	 * @param {string} agentUrl
	 * @param {number} id
	 * @param {number} exitCode
	 * @param {string} stdout
	 * @param {string} stderr
	 */
	receiveData(agentUrl, id, exitCode, stdout, stderr) {
		const status = exitCode === 0;
		const out = status ? stdout : stderr;
		const taskIndex = this._pendings.findIndex((task) => task.id === id);
		let task = this._pendings[taskIndex];

		if (taskIndex !== -1) {
			task = this._pendings[taskIndex];
			this._pendings.splice(taskIndex, 1);
		} else {
			task = new Task(id);
			this._cacheTask(task);
		}

		task.markAsExecuted(status, out);

		this._done.push(task);
		const agent = this._getAgentByUrl(agentUrl);

		if (agent) {
			agent.stopTask(task.id);
		}

		this._recycle();
	}

	/**
	 * @param {string} url
	 * @param {string} hash
	 * @param {string} command
	 */
	addTask(url, hash, command) {
		const id = ++this._lastId;
		const task = new Task(id, url, hash, command);
		if (!task.isValid()) {
			throw new Error('Not valid data');
		}

		this._queue.push(task);
		this._cacheTask(task);
		this._recycle();
	}

	/**
	 *
	 * @private
	 */
	_recyclePendings() {
		const map = this._pendings
			.filter((task) => task.timestamp >= this.MAX_PENDING_INTERVAL)
			.reduce((a, b) => {
				a[b.id] = b;
				return a;
			}, {});

		const ids = Object.keys(map).map(Number);
		const mapIdToAgent = ids.map((id) => {
			const agent = Object
				.values(this._agents)
				.find((ag) => {
					return Boolean(ag) &&
						ag.tasks.includes(id);
				}) || null;
			return {
				id,
				agent,
			};
		});

		mapIdToAgent
			.forEach(({id, agent}) => {
				const task = map[id];
				console.log('Recycle', task.id);
				if (agent) {
					this._sendTaskToAgent(task, agent);
				} else {
					const pendinIndex = this._pendings
						.findIndex((t) => t.id === id);
					const queueIndex = this._queue
						.findIndex((t) => t.id === id);

					if (pendinIndex !== -1) {
						this._pendings.splice(pendinIndex, 1);
					}

					if (queueIndex === -1) {
						this._queue.push(task);
					}

					this._recycle();
				}
			});
	}

	/**
	 * Stop when queue is empty or
	 * all Agents is busy
	 * @return {Promise<void>}
	 * @private
	 */
	async _recycle() {
		if (!this._queue.length) {
			return;
		}

		if (!this._recyclePromise) {
			const task = this._queue[0];
			this._recyclePromise = this
				._execute(task)
				.then(() => {
					this._pendings.push(task);
					this._queue.splice(0, 1);
				})
				.finally(() => {
					this._recyclePromise = null;
				})
				.then(() => this._recycle())
				.catch(() => {
					console.log('Every agent is busy or no agents exist');
				});
		}

		return await this._recyclePromise;
	}

	/**
	 * @param {Task} task
	 * @return {Promise<void>}
	 * @private
	 */
	_execute(task) {
		const sortedAgents = Object
			.values(this._agents)
			.filter(Boolean)
			.sort((a, b) => a.tasks.length - b.tasks.length);

		const send = (agents) => {
			if (!agents.length) {
				Promise.reject(new Error('No agents to send data'));
			}

			const agent = agents[0];

			return this
				._sendTaskToAgent(task, agent)
				.then(() => agent.startTask(task.id))
				.catch(() => send(agents.slice(1)));
		};

		return send(sortedAgents);
	}

	/**
	 * @param {Task} task
	 * @param {Agent} agent
	 * @return {Promise}
	 * @private
	 */
	_sendTaskToAgent(task, agent) {
		return this._api.sendTaskToAgent(agent.url, task)
			.catch((err) => {
				if (
					err instanceof Error &&
					err.code === 'ECONNREFUSED'
				) {
					this._onAgentDied(agent);
				}

				throw err;
			});
	}

	/**
	 * @param {Agent} agent
	 * @private
	 */
	_onAgentDied(agent) {
		this._pendings.forEach((task, index) => {
			if (agent.tasks.includes(task.id)) {
				this._queue.push(task);
				this._pendings.splice(index, 1);
			}
		});

		this._agents[agent.url] = null;
		this._recycle();
	}

	/**
	 * @param {Task} task
	 * @private
	 */
	_cacheTask(task) {
		this._mapIdToTask[task.id] = task;
	}

	/**
	 * @param {string} url
	 * @return {?Agent}
	 * @private
	 */
	_getAgentByUrl(url) {
		return this._agents[url] || null;
	}
}

module.exports = Engine;
