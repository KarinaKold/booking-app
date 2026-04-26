import { useState, type ChangeEvent } from 'react';
import { FaSave, FaTrashAlt } from 'react-icons/fa';
import { TableRow } from '../table-row/TableRow';
import { request } from '../../../../utils/request';
import styled from 'styled-components';
import type { Role } from '../../../../types';

interface UserRowProps {
	className?: string;
	id: string;
	login: string;
	registeredAt: string;
	roleId: number;
	roles: Role[];
	onUserRemove: () => void;
}

const UserRowContainer = ({
	className,
	id,
	login,
	registeredAt,
	roleId: userRoleId,
	roles,
	onUserRemove,
}: UserRowProps) => {
	const [initialRoleId, setInitialRoleId] = useState(userRoleId);
	const [selectedRoleId, setSelectedRoleId] = useState(userRoleId);

	const onRoleChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {
		setSelectedRoleId(Number(target.value));
	};

	const onRoleSave = (userId: string, newUserRoleId: number) => {
		request(`/users/${userId}`, 'PATCH', { roleId: newUserRoleId }).then(() => {
			setInitialRoleId(newUserRoleId);
		});
	};
	const formattedDate = new Date(registeredAt).toLocaleDateString();
	const isSaveButtonDisabled = selectedRoleId === initialRoleId;

	return (
		<div className={className}>
			<TableRow border={true}>
				<div className="login-column">{login}</div>
				<div className="registered-at-column">{formattedDate}</div>
				<div className="role-column">
					<select value={selectedRoleId} onChange={onRoleChange}>
						{roles.map(({ id: roleId, name: roleName }) => (
							<option key={roleId} value={roleId}>
								{roleName}
							</option>
						))}
					</select>
				</div>
				<div className="actions-column">
					<FaSave
						className={`icon save-icon ${isSaveButtonDisabled ? 'disabled' : ''}`}
						onClick={() =>
							!isSaveButtonDisabled && onRoleSave(id, selectedRoleId)
						}
					/>
					<FaTrashAlt className="icon delete-icon" onClick={onUserRemove} />
				</div>
			</TableRow>
		</div>
	);
};

export const UserRow = styled(UserRowContainer)`
	display: flex;
	margin-top: 8px;

	& select {
		width: 100%;
		padding: 6px 10px;
		border-radius: 8px;
		border: 1px solid #e0e0e0;
		background: #fafafa;
		font-size: 14px;
		cursor: pointer;
		outline: none;
		&:focus {
			border-color: #4caf50;
		}
	}

	& .icon {
		font-size: 18px;
		margin-left: 15px;
		cursor: pointer;
		transition: all 0.2s;
	}

	& .save-icon {
		color: #4caf50;
		opacity: 1;
		&:hover {
			transform: scale(1.1);
		}
		&.disabled {
			color: #ccc;
			cursor: default;
			&:hover {
				transform: none;
			}
		}
	}

	& .delete-icon {
		color: #ff4d4f;
		&:hover {
			color: #cf1322;
			transform: scale(1.1);
		}
	}
`;
