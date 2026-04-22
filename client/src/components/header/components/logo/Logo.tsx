import { Link } from 'react-router';
import { MAIN_TITLE } from '../../../../constants/titles';

export const Logo = () => (
	<Link className="logo" to="/">
		<div className="logo-img"></div>
		<h1 id="h1">{MAIN_TITLE}</h1>
	</Link>
);
