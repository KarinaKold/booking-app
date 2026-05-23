import { useEffect, useRef, type BaseSyntheticEvent } from 'react';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	FaGlassMartiniAlt,
	FaPlus,
	FaSave,
	FaTrash,
	FaUserFriends,
} from 'react-icons/fa';
import { useAppDispatch } from '../../../../hooks';
import { SpecialPanel } from '../special-panel/SpecialPanel';
import { Button, Input } from '../../../../components';
import { saveRestaurantAsync } from '../../../../actions';
import { minutesToTime, sanitizeContent, timeToMinutes } from './utils';
import type { RestaurantData } from '../../../HomePage/types';
import styled from 'styled-components';

const restaurantFormSchema = yup.object().shape({
	name: yup
		.string()
		.required('Заполните название ресторана')
		.min(2, 'Название слишком короткое (минимум 2 символа)'),
	address: yup.string().required('Укажите адрес заведения'),
	cuisine: yup.string().required('Укажите тип кухни'),
	startTimeValue: yup.string().required('Укажите время открытия'),
	endTimeValue: yup.string().required('Укажите время закрытия'),
	hasBarCardValue: yup.boolean().required(),
	imagesValue: yup
		.array()
		.of(
			yup
				.string()
				.url('Введите корректный URL изображения')
				.required('Заполните ссылку на изображение'),
		)
		.min(1, 'Добавьте хотя бы одно изображение')
		.required(),
	tablesValue: yup
		.array()
		.of(
			yup.object().shape({
				number: yup.number().required(),
				seats: yup
					.number()
					.typeError('Количество мест должно быть числом')
					.required('Укажите количество мест')
					.min(1, 'Минимум 1 место за столом')
					.max(20, 'Максимум 20 мест за столом'),
			}),
		)
		.min(1, 'Добавьте хотя бы один стол')
		.required(),
});

export type RestaurantFormData = yup.InferType<typeof restaurantFormSchema>;

interface RestaurantFormProps {
	className?: string;
	restaurant: RestaurantData;
}

const RestaurantFormContainer = ({
	className,
	restaurant: {
		id,
		name,
		address,
		cuisine,
		startTime,
		endTime,
		hasBarCard,
		description,
		images,
		createdAt,
		tables,
	},
}: RestaurantFormProps) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const descriptionRef = useRef<HTMLDivElement>(null);

	const {
		register,
		control,
		handleSubmit,
		getValues,
		formState: { errors, isValid, isSubmitting },
	} = useForm<RestaurantFormData>({
		mode: 'onChange',
		resolver: yupResolver(restaurantFormSchema),
		defaultValues: {
			name: name || '',
			address: address || '',
			cuisine: cuisine || '',
			startTimeValue: startTime !== undefined ? minutesToTime(startTime) : '10:00',
			endTimeValue: endTime !== undefined ? minutesToTime(endTime) : '22:00',
			hasBarCardValue: !!hasBarCard,
			imagesValue: images && images.length > 0 ? images : [''],
			tablesValue: tables?.length ? tables : [{ number: 1, seats: 2 }],
		},
	});

	const {
		fields: imageFields,
		append: appendImage,
		remove: removeImage,
	} = useFieldArray({ control, name: 'imagesValue' as never });

	const {
		fields: tableFields,
		append: appendTable,
		remove: removeTable,
	} = useFieldArray({ control, name: 'tablesValue' as never });

	useEffect(() => {
		if (imageFields.length === 0) {
			appendImage('');
		}
	}, [imageFields, appendImage]);

	const onAddTable = () => {
		const currentTables = getValues('tablesValue') || [];

		const nextNumber =
			currentTables.length > 0
				? Math.max(...currentTables.map((t) => t.number)) + 1
				: 1;
		appendTable({ number: nextNumber, seats: 2 });
	};

	const onSave = async (data: RestaurantFormData) => {
		const descriptionRefElement = descriptionRef.current?.innerHTML || '';
		const newDescription = sanitizeContent(descriptionRefElement);

		const response = await dispatch(
			saveRestaurantAsync(id, {
				name: data.name,
				address: data.address,
				cuisine: data.cuisine,
				startTime: timeToMinutes(data.startTimeValue),
				endTime: timeToMinutes(data.endTimeValue),
				hasBarCard: data.hasBarCardValue,
				images: data.imagesValue,
				description: newDescription,
				tables: data.tablesValue,
			}),
		);

		if (response?.data?.id) {
			navigate(`/rest/${response.data.id}`);
		}
	};

	const onSubmit = (e: BaseSyntheticEvent) => {
		e.preventDefault();
		handleSubmit(onSave)(e);
	};

	return (
		<div className={className}>
			<h2>{id ? 'Редактирование ресторана' : 'Добавление ресторана'}</h2>
			<form onSubmit={onSubmit}>
				<div className="inputs">
					<div className="input-field">
						<Input placeholder="Название..." {...register('name')} />
						{errors.name && (
							<span className="error-text">{errors.name.message}</span>
						)}
					</div>
					<div className="input-field">
						<Input placeholder="Адрес..." {...register('address')} />
						{errors.address && (
							<span className="error-text">{errors.address.message}</span>
						)}
					</div>
					<div className="input-field">
						<Input placeholder="Кухня..." {...register('cuisine')} />
						{errors.cuisine && (
							<span className="error-text">{errors.cuisine.message}</span>
						)}
					</div>
					<div className="time-inputs-wrapper">
						<div className="time-field">
							<label>Часы работы:</label>
							<Input
								type="time"
								className="time-input"
								{...register('startTimeValue')}
							/>
							<span className="time-separator">—</span>
							<Input
								type="time"
								className="time-input"
								{...register('endTimeValue')}
							/>
						</div>
						{(errors.startTimeValue || errors.endTimeValue) && (
							<span className="error-text">
								Заполните часы работы заведения
							</span>
						)}
					</div>
					<div className="checkbox-wrapper">
						<label className="checkbox-label">
							<input type="checkbox" {...register('hasBarCardValue')} />
							<FaGlassMartiniAlt className="bar-icon" /> Барная карта
						</label>
					</div>
					<div className="images-section">
						<h3>Изображения (URL)</h3>
						<div className="images-inputs">
							{imageFields.map((field, i) => (
								<div key={field.id} className="image-field-container">
									<div className="image-input-wrapper">
										<Input
											placeholder={`URL изображения ${i + 1}...`}
											{...register(`imagesValue.${i}` as never)}
										/>
										<FaTrash
											className="delete-image"
											onClick={() =>
												imageFields.length > 1 && removeImage(i)
											}
										/>
									</div>
									{errors.imagesValue?.[i] && (
										<span className="error-text">
											{errors.imagesValue[i]?.message}
										</span>
									)}
								</div>
							))}
						</div>
						<Button
							type="button"
							onClick={() => appendImage('')}
							style={{ marginTop: '10px', width: 'fit-content' }}
						>
							<FaPlus /> Добавить фото
						</Button>
					</div>
				</div>
				<div className="tables-constructor">
					<h3>
						<FaUserFriends /> Столы
					</h3>
					<div className="tables-list">
						{tableFields.map((field, i: number) => {
							const tableError = errors.tablesValue?.[i]?.seats;
							const typedField = field as typeof field & {
								number: number;
								seats: number;
							};
							return (
								<div key={field.id} className="table-field-container">
									<div className="table-item">
										<span>Стол №{typedField.number}</span>
										<input
											type="number"
											min="1"
											{...register(
												`tablesValue.${i}.seats` as const,
											)}
										/>
										<label>мест</label>
										<FaTrash
											className="delete-table"
											onClick={() => removeTable(i)}
										/>
									</div>
									{tableError && (
										<span className="error-text">
											{tableError.message}
										</span>
									)}
								</div>
							);
						})}
					</div>
					<Button type="button" onClick={onAddTable}>
						<FaPlus /> Добавить стол
					</Button>
				</div>
				<SpecialPanel
					id={id}
					createdAt={createdAt}
					margin="20px 0"
					editButton={
						<button
							type="submit"
							disabled={!isValid || isSubmitting}
							className="save-btn-wrapper"
						>
							<FaSave
								className={`save-icon ${!isValid || isSubmitting ? 'disabled' : ''}`}
							/>
						</button>
					}
				/>
			</form>
			<div
				ref={descriptionRef}
				contentEditable={true}
				suppressContentEditableWarning={true}
				className="description-text"
			>
				{description}
			</div>
		</div>
	);
};

export const RestaurantForm = styled(RestaurantFormContainer)`
	max-width: 900px;
	margin: 20px auto;
	padding: 0 40px;

	h2 {
		font-size: 2.2rem;
		color: var(--color);
	}

	& .inputs {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	& .time-inputs-wrapper {
		margin: 5px 0;
		padding: 15px;
		background: #f0f0f0;
		border-radius: 12px;
		box-shadow:
			inset 4px 4px 8px #bebebe,
			inset -4px -4px 8px #ffffff;
	}

	& .delete-image {
		display: flex;
		margin-top: 10px;
		color: #888;
		cursor: pointer;
		transition: color 0.2s;
	}

	& .delete-image:hover {
		color: #ff4d4f;
	}

	& .time-field {
		display: flex;
		align-items: center;
		gap: 15px;
		font-weight: 500;
		color: #555;
	}
	& .time-field label {
		width: 300px;
	}

	& .images-inputs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 15px;
		margin: 15px 0;
	}

	& .images-inputs input {
		margin-bottom: 0;
	}

	& .time-separator {
		font-weight: bold;
		color: #888;
		padding-bottom: 12px;
	}

	& .checkbox-wrapper {
		margin: 5px 0;
		padding: 10px;
		background: #f0f0f0;
		border-radius: 8px;
		box-shadow:
			inset 2px 2px 5px #bebebe,
			inset -2px -2px 5px #ffffff;
		width: fit-content;
	}

	& .checkbox-label {
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
		font-size: 16px;
		color-: #333;
	}

	& .checkbox-label input {
		width: 18px;
		height: 18px;
		cursor: pointer;
		accent-color: #e91e63;
	}

	& .bar-icon {
		color: #e91e63;
	}

	& .description-text {
		border: 3px solid #ccc;
		padding: 15px;
		min-height: 150px;
		font-size: 16px;
		white-space: pre-line;
	}

	& .tables-constructor {
		margin-top: 20px;
		padding: 15px;
		border-radius: 8px;
		background: var(--select-bg);
		border: var(--select-border);
		box-shadow: var(--nm-shadow-inset);
	}

	& .table-item {
		display: flex;
		align-items: center;
		gap: 15px;
		margin-bottom: 15px;
		padding: 15px 20px;
		border-radius: 12px;
		color: var(--color);
		background: var(--card-background);
		box-shadow: var(--nm-shadow-flat);

		span {
			font-weight: 600;
			min-width: 80px;
		}

		input {
			border: none;
			background: var(--select-bg);
			color: var(--color);
			padding: 8px;
			border-radius: 8px;
			bbox-shadow: var(--nm-shadow-inset);
			width: 60px;
			text-align: center;
		}
	}

	& .delete-table {
		color: #cc0000;
		cursor: pointer;
	}

	& img {
		float: left;
		margin: 0 20px 10px 0;
	}

	& .post-text {
		border: 1px solid #000;
		min-height: 80px;
		font-size: 18px;
		white-space: pre-line;
	}

	& .save-icon {
		font-size: 21px;
		margin: 0 10px 0 0;
		cursor: pointer;
		color: var(--color-muted);

		&:hover {
			color: var(--color);
		}
	}

	/**/
	& .input-field {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
	}

	& .image-field-container,
	& .table-field-container {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
	}

	& .error-text {
		color: #ff4d4f;
		font-size: 13px;
		font-weight: 500;
		padding-left: 10px;
		animation: fadeIn 0.2s ease-in;
	}
	& .save-btn-wrapper {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;

		&:disabled {
			cursor: not-allowed;
		}
	}

	& .save-icon.disabled {
		color: #ccc;
		cursor: not-allowed;
		&:hover {
			color: #ccc;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
`;
