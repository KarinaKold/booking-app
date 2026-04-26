import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../hooks';
import { Button, LangSwitcher, ThemeSwitcher } from '../../../../components';
import { useGetConfirmation } from '../../../../providers';
import { selectUserLogin, selectUserRole } from '../../../../selectors';
import { logout } from '../../../../actions';
import { checkAccess } from '../../../../utils';
import { ROLE } from '../../../../constants';
import styled from 'styled-components';

const RightAligned = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;

const UserName = styled.div`
	margin-right: 16px;
	font-size: 18px;
	font-weight: bold;
	a {
		color: #0ea5e9;
		&:hover {
			text-decoration: none;
		}
	}
`;

const PrivateLink = styled.div`
	margin-right: 16px;
	font-size: 18px;
	font-weight: bold;

	a {
		text-decoration: none;
		color: #0ea5e9;
	}
`;

export const ControlPanelContainer = ({ className }: { className?: string }) => {
	const dispatch = useAppDispatch();
	const { getConfirmation } = useGetConfirmation();
	const roleId = useSelector(selectUserRole);
	const login = useSelector(selectUserLogin);

	const onLogout = async (): Promise<void> => {
		const confirmed = await getConfirmation({
			title: 'Выход из аккаунта',
			description: 'Вы уверены, что хотите выйти?',
			confirmText: 'Выйти',
			closeText: 'Отмена',
		});

		if (confirmed) {
			dispatch(logout());
			sessionStorage.removeItem('userData');
		}
	};

	const isAdmin = checkAccess([ROLE.ADMIN], roleId);
	const isModerator = checkAccess([ROLE.MODERATOR], roleId);

	return (
		<div className={className}>
			<LangSwitcher />
			<ThemeSwitcher />
			<RightAligned>
				{isAdmin && (
					<>
						<PrivateLink>
							<Link to="/users">Users</Link>
						</PrivateLink>
					</>
				)}
				{isModerator && (
					<>
						<PrivateLink>
							<Link to="/rest">Create!</Link>
						</PrivateLink>
					</>
				)}
			</RightAligned>
			<RightAligned>
				{roleId === ROLE.GUEST ? (
					<Button>
						<Link to="/login">Войти</Link>
					</Button>
				) : (
					<>
						<UserName>
							<Link to="/profile">{login}</Link>
						</UserName>
						<Button onClick={onLogout}>Выйти</Button>
					</>
				)}
			</RightAligned>
		</div>
	);
};

export const ControlPanel = styled(ControlPanelContainer)`
	display: flex;
	align-items: center;
	gap: 26px;
`;
