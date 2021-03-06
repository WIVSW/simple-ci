const {promisify} = require('util');
const path = require('path');
const fse = require('fs-extra');
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

	try {
		await fse.ensureDir(deps.buildFolder);
		await fse.remove(`${deps.buildFolder}/${id}`);
		const cloneResult = await
		execute(`git clone ${url} ${id}`, deps.buildFolder);
		const buildResult = await
		execute(`git checkout ${hash} && ${command}`, repoPath);

		out.stdout += [cloneResult, buildResult].reduce((out, result) => {
			const str = result && result.stdout || '';
			return `${out}${str}\n`;
		}, '');
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