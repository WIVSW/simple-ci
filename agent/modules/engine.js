/**
 */
class Engine {
	/**
	 * @param {Object} api
	 * @param {Object} actions
	 */
	constructor(api, actions) {
		/**
		 * @const {number}
		 */
		this.MAX_QUEUE_SIZE = 10;

		/**
		 * @type {Object}
		 * @private
		 */
		this._api = api;

		/**
		 * @type {Object}
		 * @private
		 */
		this._actions = actions;

		/**
		 * @type {Array<Task>}
		 * @private
		 */
		this._queue = [];

		/**
		 * @type {Object<number, Promise<void>>}
		 * @private
		 */
		this._promises = {};

		/**
		 * @type {Array<Object>}
		 * @private
		 */
		this._done = [];
	}

	/**
	 * @param {Task} task
	 * @return {boolean}
	 */
	addTask(task) {
		if (this._queue.length >= this.MAX_QUEUE_SIZE) {
			return false;
		}

		if (this._promises[task.id]) {
			console.log('Task', task.id, 'already executing');
			return true;
		}

		if (this._done.map((report) => report.id).includes(task.id)) {
			console.log('Task', task.id, 'waiting for send');
			this._sendReports();
			return true;
		}

		console.log('Receive task', task.id);
		this._queue.push(task);
		this._recycle();
		return true;
	}

	/**
	 * @param {Task} task
	 * @private
	 */
	async _execute(task) {
		let exitCode;
		let stdout;
		let stderr;

		try {
			console.log('Start task', task.id);
			const result = await this._actions.run(task);
			exitCode = result.code;
			stdout = result.stdout;
			stderr = result.stderr;
		} catch (e) {
			console.log('Fail task', task.id);
			exitCode = -1;
			stdout = '';
			stderr = '';
		}

		console.log('Finish task', task.id);

		const index = this._queue.findIndex(({id}) => task.id === id);
		this._queue.splice(index, 1);
		this._done.push({
			id: task.id,
			exitCode,
			stdout,
			stderr,
		});

		this._sendReports();
	}

	/**
	 * @return {Promise<void>}
	 * @private
	 */
	_sendReports() {
		if (this._sendingPromise) {
			return this._sendingPromise;
		}

		if (!this._done.length) {
			return Promise.resolve();
		}

		this._sendingPromise = this._done
			.reduce((a, b) => {
				return a
					.then(() => {
						console.log(`Send task ${b.id}`);
						return this._api.sendResult(b);
					})
					.then(() => {
						console.log(`Task ${b.id} sended`);
						const index = this._done.findIndex((report) => report.id === b.id);
						this._done.splice(index, 1);
					});
			}, Promise.resolve());

		return this._sendingPromise
			.finally(() => this._sendingPromise = null)
			.then(() => this._sendReports());
	}

	/**
	 * @return {Promise<void>}
	 * @private
	 */
	_recycle() {
		this._sendReports();

		const notExecingTask = this
			._queue.find((task) => !this._promises[task.id]);

		if (!notExecingTask) {
			return Promise.resolve();
		}

		this._promises[notExecingTask.id] = this
			._execute(notExecingTask)
			.finally(() => this._promises[notExecingTask.id] = null);

		return this._promises[notExecingTask.id];
	}
}

module.exports = Engine;
