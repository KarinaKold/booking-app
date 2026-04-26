import type { ComponentProps } from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { IoClose } from 'react-icons/io5';

interface ModalCloseButtonProps extends Omit<ComponentProps<typeof Button>, 'children'> {
	iconSize?: number;
}

export const ModalCloseButton = ({ iconSize = 20, ...props }: ModalCloseButtonProps) => {
	return (
		<StyledCloseButton type="button" aria-label="Close" {...props}>
			<IoClose size={iconSize} />
		</StyledCloseButton>
	);
};

export const StyledCloseButton = styled(Button)`
	position: absolute;
	top: 20px;
	right: 20px;
	width: 35px;
	height: 35px;
	padding: 0;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 14px;
	color: #888;
	box-shadow: none;

	&:hover {
		background: #e8e8e8;
		color: #333;
		box-shadow: none;
	}
`;
