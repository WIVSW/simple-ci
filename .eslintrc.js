module.exports = {
	'env': {
		'commonjs': true,
		'es6': true,
		'node': true,
	},
	'extends': [
		'google',
	],
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly',
	},
	'parserOptions': {
		'ecmaVersion': 2018,
		'sourceType': 'module',
	},
	'rules': {
		'no-tabs': 'off',
		'no-invalid-this': 'off',
		'indent': [ 'error', 'tab' ],
		'new-cap': [ 2, { 'capIsNewExceptions': [
				"express.Router"
			]
		}]
	},
};
