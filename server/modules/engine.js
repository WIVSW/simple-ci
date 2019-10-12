const Task = require('../models/task');

/**
 */
class Engine {
	/**
	 * @param {Object} api
	 */
	constructor(api) {
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
	 * @param {number} id
	 * @param {number} exitCode
	 * @param {string} stdout
	 * @param {string} stderr
	 */
	recieveData(id, exitCode, stdout, stderr) {
		const status = exitCode === 0;
		const out = status ? stdout : stderr;
		const taskIndex = this._pendings.findIndex((task) => task.id === id);
		let task = this._pendings[taskIndex];

		if (taskIndex !== -1) {
			task = this._pendings[taskIndex];
			this._pendings.splice(taskIndex, 1);
		} else {
			task = new Task(id);
		}

		task.markAsExecuted(status, out);

		this._done.push(task);

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
		this._recycle();
	}

	/**
	 * @param {Task} task
	 * @private
	 */
	_cacheTask(task) {
		this._mapIdToTask[task.id] = task;
	}
}

module.exports = Engine;
