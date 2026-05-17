import styled from 'styled-components';

export const TabButton = styled.button<{ $active?: boolean; $isAction?: boolean }>`
	width: 100%;
	display: flex;
	align-items: center;
	gap: 15px;
	padding: 15px 20px;
	margin-bottom: 10px;
	border: none;
	border-radius: 15px;
	background: ${(props) => (props.$active ? '#f0f0f0' : 'transparent')};
	color: ${(props) => (props.$isAction ? '#e91e63' : '#333')};
	font-size: 16px;
	font-weight: ${(props) => (props.$active ? '600' : '500')};
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		background: #f5f5f5;
		transform: translateX(5px);
	}
	svg {
		font-size: 20px;
		min-width: 20px;
	}
`;
