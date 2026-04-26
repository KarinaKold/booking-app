import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../../components';
import { setUser } from '../../actions';
import { selectUserRole } from '../../selectors';
import { ROLE } from '../../constants';
import { useAppDispatch, useResetForm } from '../../hooks';
import { request } from '../../utils/request';
import { Button } from '../../components/shared/buttons/Button';
import styled from 'styled-components';
import type { UserData } from '../../types';

const regFormSchema = yup.object().shape({
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
	passcheck: yup
		.string()
		.required('Заполните повтор пароля')
		.oneOf([yup.ref<string>('password')], 'Повтор пароля не совпадает'),
});

type RegFormData = yup.InferType<typeof regFormSchema>;

interface AuthResponse {
	user: UserData | null;
	error: string | null;
}

const RegistrationContainer = ({ className }: { className?: string }) => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
			passcheck: '',
		},
		resolver: yupResolver(regFormSchema),
	});

	const [serverError, setServerError] = useState<string | null>(null);
	const dispatch = useAppDispatch();
	const roleId = useSelector(selectUserRole);
	useResetForm(reset);

	const onSubmit = async ({ login, password }: RegFormData) => {
		try {
			const { error, user } = await request<AuthResponse>('/register', 'POST', {
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
		} catch {
			setServerError('Ошибка сервера. Попробуйте позже.');
		}
	};

	const formError =
		errors?.login?.message || errors?.password?.message || errors?.passcheck?.message;
	const errorMessage = formError || serverError;

	if (roleId !== ROLE.GUEST) {
		return <Navigate to="/" />;
	}

	return (
		<div className={className}>
			<h2>Регистрация</h2>
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
				<Input
					type="password"
					id="passcheck"
					placeholder="Проверка пароля..."
					{...register('passcheck', {
						onChange: () => setServerError(null),
					})}
				/>
				<Button type="submit" disabled={!!formError}>
					Зарегистрироваться
				</Button>
				{errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
			</form>
		</div>
	);
};

export const RegPage = styled(RegistrationContainer)`
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
