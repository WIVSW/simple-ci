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

const renderBuildRow = ({id, status}) => {
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

	return `
		<tr>
			<td>${id}</td>
			<td>${text}</td>
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
			${builds.length ? builds.map((a) => renderBuildRow(a)).join('') : ''}
		</table>
	`;
};

module.exports = {
	renderIndexPage,
};
