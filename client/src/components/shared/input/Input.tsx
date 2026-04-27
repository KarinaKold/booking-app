import type { InputHTMLAttributes, Ref } from 'react';
import styled from 'styled-components';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	className?: string;
	width?: string;
	ref?: Ref<HTMLInputElement>;
}

const InputContainer = ({ className, ref, ...props }: InputProps) => {
	return <input className={className} {...props} ref={ref} />;
};

export const Input = styled(InputContainer)`
	background: #e0e0e0;
	border-radius: 12px;
	box-shadow:
		inset 6px 6px 10px #b8b8b8,
		inset -6px -6px 10px #ffffff;
	border: none;
	padding: 10px;
	font-size: 16px;
	width: ${({ width = '100%' }) => width};
	transition: box-shadow 0.3s ease;
	margin: 0 0 10px;
}
	&:focus {
	outline: none;
	box-shadow:
		inset 4px 4px 10px #b8b8b8,
		inset -4px -4px 10px #ffffff,
		0 0 0 3px #0ea5e9;;
}

&::placeholder {
	color: #a0a0a0;
}
`;
