import type { ComponentProps } from 'react';
import styled from 'styled-components';

const ButtonContainer = ({ children, className, ...props }: ComponentProps<'button'>) => {
	return (
		<button className={className} {...props}>
			{children}
		</button>
	);
};

export const Button = styled(ButtonContainer)`
	background: var(--background-color);
	color: var(--color);
	border-radius: 12px;
	box-shadow: var(--nm-shadow-flat);
	border: none;
	padding: 10px 20px;
	font-size: 16px;
	cursor: pointer;
	transition: all 0.3s ease;

	&:hover {
		box-shadow: var(--nm-shadow-inset);
	}

	&:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgb(126, 236, 255);
	}

	&:active {
		box-shadow: var(--nm-shadow-inset);
	}

	&:disabled {
		background: #d0d0d0;
		color: #a0a0a0;
		cursor: not-allowed;
		box-shadow: none;
	}

	a {
		color: inherit;
		text-decoration: none;
		font-weight: 600;
	}
`;
