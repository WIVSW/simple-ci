const {promisify} = require('util');
const path = require('path');
const fse = require('fs-extra');
const {spawn} = require('child_process');
const readline = require('readline');
const exec = promisify(require('child_process').exec);

const deps = {
	buildFolder: null,
};

const execute = async (cmd, cwd) => {
	return await exec(
		cmd, {
			cwd,
		}
	);
};

/**
 * @param {string} id
 * @param {string} url
 * @param {string} hash
 * @param {string} command
 */
const run = async ({id, url, hash, command}) => {
	const repoPath = path.resolve(deps.buildFolder, `./${id}`);

	const out = {
		code: null,
		stdout: '',
		stderr: '',
	};

	await fse.ensureDir(deps.buildFolder);
	await execute(`git clone ${url} ${id}`, deps.buildFolder);
	try {
		const result = await
		execute(`git checkout ${hash} && ${command}`, repoPath);

		out.stdout += result.stdout + '\n';
		out.code = 0;
		console.log(out.stdout);
	} catch (error) {
		out.code = error.status;
		out.stderr += error.stderr + '\n';
		console.log(out.stderr);
	}
	await fse.remove(`${deps.buildFolder}/${id}`);

	return out;
};

module.exports = ({buildFolder}) => {
	deps.buildFolder = path.resolve(__dirname, '../../', buildFolder);
	return {
		run,
	};
};