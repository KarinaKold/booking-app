import type { ReactNode } from 'react';
import styled from 'styled-components';

interface TableRowProps {
	children: ReactNode;
	className?: string;
}

const TableRowContainer = ({ className, children }: TableRowProps) => (
	<div className={className}>{children}</div>
);

export const TableRow = styled(TableRowContainer)<{ border?: boolean }>`
	display: flex;
	align-items: center;
	padding: 10px 20px;
	background: ${({ border }) => (border ? 'var(--card-background)' : 'transparent')};
	width: 100%;
	border-bottom: 1px solid #888;

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
		color: var(--color);
		opacity: 0.5;
		font-size: 13px;
		text-transform: uppercase;
		letter-spacing: 1px;
	`}
`;
