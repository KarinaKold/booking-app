import styled from 'styled-components';
import { Button } from './Button';

export const BookButton = styled(Button)`
	font-size: 14px;
	background: #4caf50;
	color: white;
	box-shadow: 4px 4px 10px rgba(76, 175, 80, 0.3);

	&:hover {
		background: #45a049;
		box-shadow: 4px 4px 12px rgba(76, 175, 80, 0.4);
	}
`;
