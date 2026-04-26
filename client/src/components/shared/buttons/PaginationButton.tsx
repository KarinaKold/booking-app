import styled from 'styled-components';
import { Button } from './Button';

export const PaginationButton = styled(Button)`
	margin: 0;
	padding: 0;
	width: 40px;
	height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 18px;

	&:hover,
	&:active {
		color: #0ea5e9;
	}
`;
