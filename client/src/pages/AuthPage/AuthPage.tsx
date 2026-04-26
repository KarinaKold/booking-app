import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../hooks';
import { Button, Input } from '../../components';
import { setUser } from '../../actions';
import { selectUserRole } from '../../selectors';
import { useResetForm } from '../../hooks/use-reset-form';
import { request } from '../../utils/request';
import { ROLE } from '../../constants';
import styled from 'styled-components';
import type { UserData } from '../../types';

const authFormSchema = yup.object().shape({
	login: yup
		.string()
		.required('Заполните логин')
		.matches(/^\w+$/, 'Неверно заполнен логин. Допускаются только буквы и цифры')
		.min(3, 'Неверно заполнен. Минимум 3 символов')
		.max(15, 'Неверно заполнен. Максимум 15 символов'),
	password: yup
		.string()
		.required('Заполните пароль')
		.matches(
			/^[\w#%]+$/,
			'Неверно заполнен пароль. Допускаются буквы, цифры и знаки № %',
		)
		.min(6, 'Неверно заполнен пароль. Минимум 6 символов')
		.max(30, 'Неверно заполнен пароль. Максимум 30 символов'),
});

type AuthFormData = yup.InferType<typeof authFormSchema>;

interface AuthResponse {
	user: UserData;
	error: string | null;
}

const StyledLink = styled(Link)`
	text-align: center;
	text-decoration: underline;
	color: black;
	margin: 20px 0;
	font-size: 18px;
`;

const AuthorizationContainer = ({ className }: { className?: string }) => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthFormData>({
		defaultValues: {
			login: '',
			password: '',
		},
		resolver: yupResolver(authFormSchema),
	});

	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [serverError, setServerError] = useState<string | null>(null);
	const roleId = useSelector(selectUserRole);
	useResetForm(reset);

	const onSubmit = async ({ login, password }: AuthFormData) => {
		try {
			setServerError(null);
			const { error, user } = await request<AuthResponse>('/login', 'POST', {
				login,
				password,
			});

			if (error) {
				setServerError(`Ошибка запроса: ${error}`);
				return;
			}

			if (user) {
				dispatch(setUser(user));
				sessionStorage.setItem('userData', JSON.stringify(user));
			}
		} catch (error) {
			console.error(error);
			setServerError('Произошла непредвиденная ошибка. Попробуйте позже.');
		}
	};

	const formError = errors?.login?.message || errors?.password?.message;
	const errorMessage = formError || serverError;

	if (roleId !== ROLE.GUEST) {
		return <Navigate to="/" />;
	}

	return (
		<div className={className}>
			<h2>Авторизация</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					type="text"
					id="login"
					placeholder="Логин..."
					{...register('login', {
						onChange: () => setServerError(null),
					})}
				/>
				<Input
					type="password"
					id="password"
					placeholder="Пароль..."
					{...register('password', {
						onChange: () => setServerError(null),
					})}
				/>
				<Button type="submit" disabled={!!formError}>
					{t('auth.login')}
				</Button>
				{errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
				<StyledLink to="/register">{t('auth.register')}</StyledLink>
			</form>
		</div>
	);
};

export const AuthPage = styled(AuthorizationContainer)`
	display: flex;
	flex-direction: column;
	align-items: center;

	& > form {
		display: flex;
		flex-direction: column;
		width: 260px;
	}
`;

export const AuthFormError = styled.div`
	background-color: #fcadad;
	padding: 10px;
	margin: 10px 0 0;
	font-size: 18px;
`;
