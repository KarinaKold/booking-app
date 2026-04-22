import { useLayoutEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { SpecialPanel } from '../special-panel/SpecialPanel';
import { saveRestaurantAsync } from '../../../../actions';
import { sanitizeContent } from './utils';
import styled from 'styled-components';
import { Input } from '../../../../components';
import { FaPlus, FaSave, FaTrash, FaUserFriends } from 'react-icons/fa';

const RestaurantFormContainer = ({
	className,
	restaurant: {
		id,
		name,
		address,
		cuisine,
		workingHours,
		description,
		images,
		createdAt,
		tables,
	},
}) => {
	const [nameValue, setNameValue] = useState(name);
	const [addressValue, setAddressValue] = useState(address);
	const [cuisineValue, setCuisineValue] = useState(cuisine);
	const [workingHoursValue, setWorkingHoursValue] = useState(workingHours);
	const [imagesValue, setImagesValue] = useState(images || ['', '', '', '']);
	const [tablesValue, setTablesValue] = useState(tables || [{ number: 1, seats: 2 }]);
	const descriptionRef = useRef(null);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useLayoutEffect(() => {
		setNameValue(name);
		setAddressValue(address);
		setCuisineValue(cuisine);
		setWorkingHoursValue(workingHours);
		setImagesValue(images?.length ? images : ['', '', '', '']);
		setTablesValue(tables?.length ? tables : [{ number: 1, seats: 2 }]);
	}, [name, address, cuisine, workingHours, images, tables]);

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
		dispatch(
			saveRestaurantAsync(id, {
				name: nameValue,
				address: addressValue,
				cuisine: cuisineValue,
				workingHours: workingHoursValue,
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
				<Input
					value={workingHoursValue}
					placeholder="Часы работы..."
					onChange={({ target }) => setWorkingHoursValue(target.value)}
				/>

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
				<button type="button" className="add-table-btn" onClick={onAddTable}>
					<FaPlus /> Добавить стол
				</button>
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
	& .inputs {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	& .description-text {
		border: 1px solid #ccc;
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

	& .table-item input {
		width: 50px;
		padding: 3px;
	}
	& .delete-table {
		color: #cc0000;
		cursor: pointer;
	}
	& .add-table-btn {
		margin-top: 10px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 5px;
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
