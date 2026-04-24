import { useLayoutEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { SpecialPanel } from '../special-panel/SpecialPanel';
import { saveRestaurantAsync } from '../../../../actions';
import { sanitizeContent } from './utils';
import styled from 'styled-components';
import { Input } from '../../../../components';
import {
	FaGlassMartiniAlt,
	FaPlus,
	FaSave,
	FaTrash,
	FaUserFriends,
} from 'react-icons/fa';
import { Button } from '../../../../components/buttons/Button';

const RestaurantFormContainer = ({
	className,
	restaurant: {
		id,
		name,
		address,
		cuisine,
		workingHours,
		hasBarCard,
		description,
		images,
		createdAt,
		tables,
	},
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [nameValue, setNameValue] = useState(name);
	const [addressValue, setAddressValue] = useState(address);
	const [cuisineValue, setCuisineValue] = useState(cuisine);
	const [startTime, setStartTime] = useState('10:00');
	const [endTime, setEndTime] = useState('22:00');
	// const [workingHoursValue, setWorkingHoursValue] = useState(workingHours);
	const [hasBarCardValue, setHasBarCardValue] = useState(!!hasBarCard);
	const [imagesValue, setImagesValue] = useState(images || ['', '', '', '']);
	const [tablesValue, setTablesValue] = useState(tables || [{ number: 1, seats: 2 }]);
	const descriptionRef = useRef(null);

	useLayoutEffect(() => {
		setNameValue(name);
		setAddressValue(address);
		setCuisineValue(cuisine);
		// setWorkingHoursValue(workingHours);
		setHasBarCardValue(!!hasBarCard);
		setImagesValue(images?.length ? images : ['', '', '', '']);
		setTablesValue(tables?.length ? tables : [{ number: 1, seats: 2 }]);

		if (workingHours && workingHours.includes(' - ')) {
			const [start, end] = workingHours.split(' - ');
			setStartTime(start);
			setEndTime(end);
		}
	}, [name, address, cuisine, workingHours, images, tables, hasBarCard]);

	const onAddTable = () => {
		const nextNumber =
			tablesValue.length > 0
				? Math.max(...tablesValue.map((t) => t.number)) + 1
				: 1;
		setTablesValue([...tablesValue, { number: nextNumber, seats: 2 }]);
	};

	const onRemoveTable = (number) => {
		setTablesValue(tablesValue.filter((t) => t.number !== number));
	};

	const onSeatsChange = (number, seats) => {
		setTablesValue(
			tablesValue.map((t) =>
				t.number === number ? { ...t, seats: Number(seats) } : t,
			),
		);
	};

	const onSave = () => {
		const newDescription = sanitizeContent(descriptionRef.current.innerHTML);
		const formattedWorkingHours = `${startTime} - ${endTime}`;

		dispatch(
			saveRestaurantAsync(id, {
				name: nameValue,
				address: addressValue,
				cuisine: cuisineValue,
				workingHours: formattedWorkingHours,
				hasBarCard: hasBarCardValue,
				images: imagesValue,
				description: newDescription,
				tables: tablesValue,
			}),
		).then(({ id }) => navigate(`/rest/${id}`));
	};

	const onImageChange = (index, value) => {
		const newImages = [...imagesValue];
		newImages[index] = value;
		setImagesValue(newImages);
	};

	return (
		<div className={className}>
			<div className="inputs">
				<Input
					value={nameValue}
					placeholder="Название..."
					onChange={({ target }) => setNameValue(target.value)}
				/>
				<Input
					value={addressValue}
					placeholder="Адрес..."
					onChange={({ target }) => setAddressValue(target.value)}
				/>
				<Input
					value={cuisineValue}
					placeholder="Кухня..."
					onChange={({ target }) => setCuisineValue(target.value)}
				/>
				<div className="time-inputs-wrapper">
					<div className="time-field">
						<label>Часы работы:</label>
						<Input
							type="time"
							value={startTime}
							onChange={({ target }) => setStartTime(target.value)}
							className="time-input"
						/>
						<span className="time-separator">—</span>
						<Input
							type="time"
							value={endTime}
							onChange={({ target }) => setEndTime(target.value)}
							className="time-input"
						/>
					</div>
				</div>

				{/* <Input
					value={workingHoursValue}
					placeholder="Часы работы..."
					onChange={({ target }) => setWorkingHoursValue(target.value)}
				/> */}

				<div className="checkbox-wrapper">
					<label className="checkbox-label">
						<input
							type="checkbox"
							checked={hasBarCardValue}
							onChange={({ target }) => setHasBarCardValue(target.checked)}
						/>
						<FaGlassMartiniAlt className="bar-icon" />
						Барная карта
					</label>
				</div>
				<div className="images-inputs">
					{imagesValue.map((url, i) => (
						<Input
							key={i}
							value={url}
							placeholder={`URL изображения ${i + 1}...`}
							onChange={({ target }) => onImageChange(i, target.value)}
						/>
					))}
				</div>
			</div>

			<div className="tables-constructor">
				<h3>
					<FaUserFriends /> Конструктор столов
				</h3>
				<div className="tables-list">
					{tablesValue.map((table) => (
						<div key={table.number} className="table-item">
							<span>Стол №{table.number}</span>
							<input
								type="number"
								min="1"
								value={table.seats}
								onChange={({ target }) =>
									onSeatsChange(table.number, target.value)
								}
							/>
							<label>мест</label>
							<FaTrash
								className="delete-table"
								onClick={() => onRemoveTable(table.number)}
							/>
						</div>
					))}
				</div>
				<Button type="button" onClick={onAddTable}>
					<FaPlus /> Добавить стол
				</Button>
			</div>
			<SpecialPanel
				id={id}
				createdAt={createdAt}
				margin="20px 0"
				editButton={<FaSave className="save-icon" onClick={onSave} />}
			/>
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
	margin: 40px auto;
	padding: 40px;

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

	// & .time-input {
	// 	border: none;
	// 	background: #f0f0f0;
	// 	padding: 8px 12px;
	// 	border-radius: 8px;
	// 	font-size: 16px;
	// 	font-family: inherit;
	// 	color: #333;
	// 	box-shadow: 3px 3px 6px #bebebe, -3px -3px 6px #ffffff;
	// 	cursor: pointer;
	// 	outline: none;
	// }

	// & .time-input:focus {
	// 	box-shadow:
	// 		inset 2px 2px 5px #bebebe,
	// 		inset -2px -2px 5px #ffffff;
	// }

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
		background: #f9f9f9;
		border-radius: 8px;
		border: 1px solid #eee;
	}

	& .table-item {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 8px;
		background: #fff;
		padding: 5px 10px;
		border-radius: 4px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	& .table-item {
		display: flex;
		align-items: center;
		gap: 15px;
		margin-bottom: 15px;
		padding: 10px 20px;
		background: #f0f0f0;
		border-radius: 12px;
		box-shadow:
			4px 4px 8px #bebebe,
			-4px -4px 8px #ffffff;

		span {
			font-weight: 600;
			min-width: 80px;
		}
		input {
			border: none;
			background: #f0f0f0;
			padding: 8px;
			border-radius: 8px;
			box-shadow:
				inset 2px 2px 5px #bebebe,
				inset -2px -2px 5px #ffffff;
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
		color: #333;

		&:hover {
			color: #000;
		}
	}
`;
