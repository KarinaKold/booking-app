import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useGetConfirmation } from '../../providers';
import { checkAccess } from '../../utils';
import { PrivateContent } from '../../components/private-content/PrivateContent';
import { UserRow, TableRow } from './components';
import { request } from '../../utils/request';
import {
	selectUserRole,
	selectUsersData,
	selectUsersDataError,
	selectUsersDataLastPage,
	selectUsersDataLoading,
	selectUsersRoles,
} from '../../selectors';
import { loadUsersAsync } from '../../actions';
import { ROLE } from '../../constants';
// import type { UserData } from '../../types';
import styled from 'styled-components';
import { Loader } from '../../components';
import { Pagination, Search } from '../HomePage/components';
import { debounce } from '../HomePage/utils';

interface Role {
	id: number;
	name: string;
}

const PAGINATION_LIMIT = 5;

const UsersContainer = ({ className }: { className?: string }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { getConfirmation } = useGetConfirmation();
	const users = useAppSelector(selectUsersData);
	const roles = useAppSelector(selectUsersRoles);
	const lastPage = useAppSelector(selectUsersDataLastPage);
	const loading = useAppSelector(selectUsersDataLoading);
	const errorMessage = useAppSelector(selectUsersDataError);
	const userRole = useAppSelector(selectUserRole);

	const [page, setPage] = useState(1);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [shouldSearch, setShouldSearch] = useState('');
	const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' });
	const [shouldUpdateUserList, setShouldUpdateUserList] = useState(false);

	const [removeError, setRemoveError] = useState<string | null>(null);

	useEffect(() => {
		if (!checkAccess([ROLE.ADMIN], userRole)) return;
		dispatch(
			loadUsersAsync(searchPhrase, page, PAGINATION_LIMIT, sort.field, sort.order),
		);
	}, [dispatch, page, shouldSearch, sort, shouldUpdateUserList, userRole]);

	const onUserRemove = async (userId: string, userLogin: string) => {
		setRemoveError(null);
		const confirmed = await getConfirmation({
			title: 'Удаление пользователя',
			description: `Вы действительно хотите удалить пользователя ${userLogin}?`,
			confirmText: 'Удалить',
			closeText: 'Отмена',
		});

		if (confirmed) {
			try {
				await request(`/users/${userId}`, 'DELETE');
				setShouldUpdateUserList(!shouldUpdateUserList);
			} catch (error) {
				console.error(error);
				setRemoveError('Не удалось удалить пользователя');
			}
		}
	};

	const handleSort = (field) => {
		setSort((prev) => ({
			field,
			order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc',
		}));
	};

	const sortStatus = (field) => {
		if (sort.field === field) {
			return sort.order === 'asc' ? '▲' : '▼';
		}
		return '↕sort';
	};

	const startDelayedSearch = useMemo(
		() =>
			debounce((value) => {
				setShouldSearch(value);
				setPage(1);
			}, 2000),
		[],
	);

	const onSearch = ({ target }: ChangeEvent<HTMLInputElement>) => {
		setRemoveError(null);
		setSearchPhrase(target.value);
		startDelayedSearch(target.value);
	};

	const error = errorMessage || removeError;

	return (
		<PrivateContent access={[ROLE.ADMIN]} serverError={error}>
			<div className={className}>
				<h2>{t('users.title')}</h2>
				<Search searchPhrase={searchPhrase} onChange={onSearch} />
				<TableRow>
					<div className="login-column" onClick={() => handleSort('login')}>
						{t('users.login')} {sortStatus('login')}
					</div>
					<div
						className="registered-at-column"
						onClick={() => handleSort('createdAt')}
					>
						{t('users.createdAt')} {sortStatus('createdAt')}
					</div>
					<div className="role-column">{t('users.role')}</div>
					<div className="actions-column"></div>
				</TableRow>
				{loading ? (
					<Loader />
				) : users.length ? (
					<div className="table-content">
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
				) : (
					<div>{t('users.error')}</div>
				)}
				{!loading && lastPage > 1 && users.length > 0 && (
					<Pagination page={page} setPage={setPage} lastPage={lastPage} />
				)}
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
		font-size: 28px;
		color: #1a1a1a;
		align-self: flex-start;
	}

	& .table-content {
		width: 100%;
	}
`;
