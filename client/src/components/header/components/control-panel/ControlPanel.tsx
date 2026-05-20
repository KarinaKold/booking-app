import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { Button, LangSwitcher, ThemeSwitcher } from '../../../../components';
import { useGetConfirmation } from '../../../../providers';
import { selectUserLogin, selectUserRole } from '../../../../selectors';
import { logout } from '../../../../actions';
import { checkAccess } from '../../../../utils';
import { ROLE } from '../../../../constants';
import styled from 'styled-components';

const RightAligned = styled.div`
	// display: flex;
	// justify-content: flex-end;
	// align-items: center;

	display: flex;
	align-items: center;
	gap: 16px;

	@media (max-width: 768px) {
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
		width: 100%;
	}
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

interface ControlPanelProps {
	className?: string;
	onClose: () => void;
}

export const ControlPanelContainer = ({ className, onClose }: ControlPanelProps) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { getConfirmation } = useGetConfirmation();
	const roleId = useAppSelector(selectUserRole);
	const login = useAppSelector(selectUserLogin);

	const onLogout = async (): Promise<void> => {
		const confirmed = await getConfirmation({
			title: 'Выход из аккаунта',
			description: 'Вы уверены, что хотите выйти?',
			confirmText: 'Выйти',
			closeText: 'Отмена',
		});

		if (confirmed) {
			await dispatch(logout());
			onClose();
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
							<Link to="/users" onClick={onClose}>
								Users
							</Link>
						</PrivateLink>
					</>
				)}
				{isModerator && (
					<>
						<PrivateLink>
							<Link to="/rest" onClick={onClose}>
								Create!
							</Link>
						</PrivateLink>
					</>
				)}
			</RightAligned>
			<RightAligned>
				{roleId === ROLE.GUEST ? (
					<Button>
						<Link to="/login" onClick={onClose}>
							{t('auth.login')}
						</Link>
					</Button>
				) : (
					<>
						<UserName>
							<Link to="/profile" onClick={onClose}>
								{login}
							</Link>
						</UserName>
						<Button onClick={onLogout}>{t('auth.logout')}</Button>
					</>
				)}
			</RightAligned>
		</div>
	);
};

export const ControlPanel = styled(ControlPanelContainer)<{ $isOpen: boolean }>`
	display: flex;
	align-items: center;
	gap: 26px;

	@media (max-width: 768px) {
		position: fixed;
		top: 0;
		right: 0;
		height: 100vh;
		width: 300px;
		background-color: #ffffff;
		box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
		padding: 100px 40px 40px;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		gap: 40px;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(100%)')};
		visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
		opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
		transition:
			transform 0.3s ease,
			visibility 0.3s,
			opacity 0.3s;
		z-index: 99990;

		& > ${RightAligned} {
			align-items: flex-start;
		}

		button {
			align-self: flex-start;
			margin-top: 10px;
		}

		@media (max-width: 500px) {
			width: 100vw;
			padding: 120px 40px 40px;
			align-items: center;

			& > ${RightAligned} {
				align-items: center;
			}

			button {
				align-self: center;
			}
		}
	}
`;
