import type { ComponentProps } from 'react';
import styled from 'styled-components';

const ButtonContainer = ({
	children,
	className,
	...props
}: ComponentProps<'button'>) => {
	return (
		<button className={className} {...props}>
			{children}
		</button>
	);
};

export const Button = styled(ButtonContainer)`
	background: #f0f0f0;
	border-radius: 12px;
	box-shadow:
		4px 4px 8px #bebebe,
		-4px -4px 8px #ffffff;
	border: none;
	color: #333;
	padding: 10px 20px;
	font-size: 16px;
	cursor: pointer;
	transition: all 0.3s ease;

	&:hover {
		box-shadow:
			4px 4px 10px #b8b8b8,
			-4px -4px 10px #ffffff;
	}

	&:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgb(126, 236, 255);
	}

	&:active {
		box-shadow:
			inset 4px 4px 10px #b8b8b8,
			inset -4px -4px 10px #ffffff;
	}

	&:disabled {
		background: #d0d0d0;
		color: #a0a0a0;
		cursor: not-allowed;
		box-shadow: none;
	}

	a {
		color: #444;
		text-decoration: none;
		font-weight: 600;
	}
`;
