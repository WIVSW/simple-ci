/**
 */
class Task {
	/**
	 * @param {number} id
	 * @param {string=} url
	 * @param {string=} hash
	 * @param {string=} command
	 */
	constructor(id, url, hash, command) {
		/**
		 * @type {number}
		 */
		this.id = id;

		/**
		 * @type {string}
		 */
		this.url = url || null;

		/**
		 * @type {string}
		 */
		this.hash = hash || null;

		/**
		 * @type {string}
		 */
		this.command = command || null;

		/**
		 * @type {number}
		 */
		this.status = -1;

		/**
		 * @type {string}
		 */
		this.out = '';

		/**
		 * Last modified
		 * @type {number}
		 */
		this.timestamp = Date.now();
	}

	/**
	 * @param {boolean} status
	 * @param {string} out
	 */
	markAsExecuted(status, out) {
		this.status = Number(status);
		this.out = out;
		this.timestamp = Date.now();
	}

	/**
	 * @return {boolean}
	 */
	isValid() {
		return this._isValidString(this.url) &&
			this._isValidString(this.hash) &&
			this._isValidString(this.command);
	}

	/**
	 * @param {string} string
	 * @return {boolean}
	 * @private
	 */
	_isValidString(string) {
		return typeof string === 'string' &&
			string.length > 0;
	}
}

module.exports = Task;
