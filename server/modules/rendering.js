const TEST_BUILDS = [
	{
		id: 12341235,
		status: 1,
	},
	{
		id: 6666,
		status: 0,
	},
	{
		id: 5555,
		status: -1,
	},
];

const TEST_OUT = `
Тестовый текст
с переносами строк      и с пробелами


Интересно как это будет работать.
`;

const TEST_BUILD = {
	id: 666,
	status: 1,
	out: TEST_OUT,
};

const parseStatus = (status) => {
	let text;

	switch (status) {
	case 1:
		text = 'Успешно';
		break;
	case 0:
		text = 'Не успешно';
		break;
	default:
		text = 'Ожидание';
	}

	return text;
};

const renderBuildRow = ({id, status}) => {
	return `
		<tr>
			<td>${id}</td>
			<td>${parseStatus(status)}</td>
			<td><a href="/build/${id}">Подробнее</a></td>
		</tr>
	`;
};

const renderIndexPage = (builds = TEST_BUILDS) => {
	return `
		<table>
			<tr>
				<td>id</td>
				<td>Статус</td>
				<td></td>
			</tr>
			${builds.length ? builds.map(renderBuildRow).join('') : ''}
		</table>
	`;
};

const renderBuildPage = ({id, status, out} = TEST_BUILD) => {
	return `
		<h1>Сборка #${id}</h1>
		<p>Статус: ${parseStatus(status)}</p>
		<div style="white-space: pre;">${out}</div>
`;
};

module.exports = {
	renderIndexPage,
	renderBuildPage,
};
