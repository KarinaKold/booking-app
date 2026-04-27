import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoaderWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	min-height: 100px;
`;

const Spinner = styled.div`
	width: 40px;
	height: 40px;
	border: 4px solid rgba(0, 0, 0, 0.1);
	border-left-color: #3498db;
	border-radius: 50%;
	animation: ${rotate} 1s linear infinite;
`;

export const Loader = () => {
	return (
		<LoaderWrapper>
			<Spinner />
		</LoaderWrapper>
	);
};
