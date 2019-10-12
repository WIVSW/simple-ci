/**
 */
class Task {
	/**
	 * @param {string} url
	 * @param {string} hash
	 * @param {string} command
	 */
	constructor(url, hash, command) {
		/**
		 * @type {string}
		 */
		this.url = url;

		/**
		 * @type {string}
		 */
		this.hash = hash;

		/**
		 * @type {string}
		 */
		this.command = command;

		/**
		 * Last modified
		 * @type {number}
		 */
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
