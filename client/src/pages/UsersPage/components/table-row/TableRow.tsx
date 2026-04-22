import styled from 'styled-components';

const TableRowContainer = ({ className, children }) => (
	<div className={className}>{children}</div>
);

export const TableRow = styled(TableRowContainer)`
	display: flex;
	align-items: center;
	padding: 10px 20px;
	background: ${({ border }) => (border ? '#fff' : '#f8f9fa')};
	border-bottom: 1px solid #eee;
	width: 100%;

	& > div {
		display: flex;
		align-items: center;
		padding: 0 10px;
	}

	& .login-column {
		flex: 2;
	}
	& .registered-at-column {
		flex: 2;
	}
	& .role-column {
		flex: 2;
	}
	& .actions-column {
		flex: 1;
		justify-content: flex-end;
		min-width: 80px;
	}

	${({ border }) =>
		!border &&
		`
		font-weight: 700;
		color: #888;
		font-size: 13px;
		text-transform: uppercase;
		letter-spacing: 1px;
	`}
`;
