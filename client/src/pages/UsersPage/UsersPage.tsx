import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetConfirmation } from '../../providers';
import { UserRow, TableRow } from './components';
import { ROLE } from '../../constants';
import { checkAccess } from '../../utils';
import { selectUserRole } from '../../selectors';
import { request } from '../../utils/request';
import { PrivateContent } from '../../components/private-content/PrivateContent';
import styled from 'styled-components';

const UsersContainer = ({ className }) => {
	const { getConfirmation } = useGetConfirmation();
	const [users, setUsers] = useState([]);
	const [roles, setRoles] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [shouldUpdateUserList, setShouldUpdateUserList] = useState(false);
	const userRole = useSelector(selectUserRole);

	useEffect(() => {
		if (!checkAccess([ROLE.ADMIN], userRole)) {
			return;
		}

		Promise.all([request('/users'), request('/users/roles')]).then(
			([usersRes, rolesRes]) => {
				if (usersRes.error || rolesRes.error) {
					setErrorMessage(usersRes.error || rolesRes.error);
					return;
				}

				setUsers(usersRes.data);
				setRoles(rolesRes.data);
			},
		);
	}, [shouldUpdateUserList, userRole]);

	const onUserRemove = async (userId, userLogin) => {
		const confirmed = await getConfirmation({
			title: 'Удаление пользователя',
			description: `Вы действительно хотите удалить пользователя ${userLogin}?`,
			confirmText: 'Удалить',
			closeText: 'Отмена',
		});

		if (confirmed) {
			request(`/users/${userId}`, 'DELETE').then(() => {
				setShouldUpdateUserList(!shouldUpdateUserList);
			});
		}
	};

	return (
		<PrivateContent access={[ROLE.ADMIN]} serverError={errorMessage}>
			<div className={className}>
				<h2>Пользователи</h2>
				<div>
					<TableRow>
						<div className="login-column">Логин</div>
						<div className="registered-at-column">Дата регистрации</div>
						<div className="role-column">Роль</div>
						<div className="actions-column"></div>
					</TableRow>
					{users.map(({ id, login, registeredAt, roleId }) => (
						<UserRow
							key={id}
							id={id}
							login={login}
							registeredAt={registeredAt}
							roleId={roleId}
							roles={roles.filter(
								({ id: roleId }) => roleId !== ROLE.GUEST,
							)}
							onUserRemove={() => onUserRemove(id, login)}
						/>
					))}
				</div>
			</div>
		</PrivateContent>
	);
};

export const UsersPage = styled(UsersContainer)`
	display: flex;
	flex-direction: column;
	margin: 40px auto;
	max-width: 900px;
	width: 100%;
	padding: 30px;
	background: #ffffff;
	border-radius: 25px;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);

	& h2 {
		margin-bottom: 30px;
		font-size: 28px;
		color: #1a1a1a;
		align-self: flex-start;
	}

	& .table-content {
		width: 100%;
	}
`;
