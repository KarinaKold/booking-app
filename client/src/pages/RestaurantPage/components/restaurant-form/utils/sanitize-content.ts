export const sanitizeContent = (content: string) =>
	content
		.replaceAll('&nbsp;', ' ')
		.replace('/ +/', ' ')
		.replaceAll('<div><br></div>', '\n')
		.replaceAll('<div>', '\n')
		.replaceAll('</div>', '');
