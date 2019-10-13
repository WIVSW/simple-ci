const path = require('path');
const fse = require('fs-extra');
const {spawn} = require('child_process');
const readline = require('readline');

const deps = {
	buildFolder: null,
};

const spawnCmd = async (cmd, cwd) => {
	return new Promise((resolve, reject) => {
		let out = '';
		const child = spawn(cmd, args, {
			cwd,
		});

		const r1 = readline.createInterface({
			input: child.stdout,
			terminal: false,
		});

		r1.on('line', (line) => {
			out = `${out}${line}\n`;
		});

		child.on('error', (error) => {
			reject(error);
		});

		child.on('close', (code) => {
			resolve({
				code,
				stdout: code === 0 ? out : '',
				stderr: code !== 0 ? out : '',
			});
		});
	});
};

const execute = async (cmd, cwd) => {
	const {code, stdout, stderr} = await spawnCmd(cmd, cwd);
	if (code === 0) {
		return stdout;
	} else {
		throw stderr;
	}
};

/**
 * @param {string} id
 * @param {string} url
 * @param {string} hash
 * @param {string} command
 */
const run = async ({id, url, hash, command}) => {
	await fse.ensureDir(deps.buildFolder);
	await execute(`git clone ${url} ${id}`, deps.buildFolder);
	const result = await spawnCmd(
		`git checkout ${hash} && ${command}`,
		path.resolve(deps.buildFolder, `./${id}`)
	);
	await fse.remove(`${deps.buildFolder}/${id}`);

	return result;
};

module.exports = ({buildFolder}) => {
	deps.buildFolder = path.resolve(__dirname, '../../', buildFolder);
	return {
		run,
	};
};