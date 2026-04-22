import { forwardRef } from 'react';
import styled from 'styled-components';

const InputContainer = forwardRef(({ className, ...props }, ref) => {
	return <input className={className} {...props} ref={ref} />;
});

export const Input = styled(InputContainer)`
	background: #e0e0e0;
	border-radius: 12px;
	box-shadow:
		inset 6px 6px 10px #b8b8b8,
		inset -6px -6px 10px #ffffff;
	border: none;
	padding: 10px;
	font-size: 16px;
	width: 100%;
	transition: box-shadow 0.3s ease;
	margin: 0 0 10px;
}
	&:focus {
	outline: none;
	box-shadow:
		inset 4px 4px 10px #b8b8b8,
		inset -4px -4px 10px #ffffff,
		0 0 0 3px rgba(255, 165, 0, 0.5);
}

&::placeholder {
	color: #a0a0a0;
}

	// width: ${({ width = '100%' }) => width};
	// height: 40px;
	// margin: 0 0 10px;
	// padding: 10px;
	// font-size: 18px;
	// border: 1px solid #000;
`;
