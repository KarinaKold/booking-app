import { FaUserFriends } from 'react-icons/fa';
import type { Table } from '../../../../../../HomePage/types';
import styled from 'styled-components';

interface TableGridProps {
	tables: Table[];
	busyTableIds: number[];
	selectedId: number | null;
	onSelect: (id: number) => void;
	isSelectionDisabled?: boolean;
}

export const TableGrid = ({
	tables = [],
	busyTableIds = [],
	selectedId,
	onSelect,
	isSelectionDisabled,
}: TableGridProps) => {
	return (
		<StyledTableGrid>
			{tables.map((table) => {
				const isBooked = busyTableIds.includes(table.number);
				const isSelected = selectedId === table.number;

				return (
					<button
						key={table._id}
						type="button"
						disabled={isBooked || isSelectionDisabled}
						className={`
                            table
                            ${isSelected ? 'selected' : ''}
                            ${isBooked ? 'booked' : ''}
                        `}
						onClick={() => onSelect(table.number)}
					>
						<span className="number">№{table.number}</span>
						<div className="seats">
							<FaUserFriends /> {table.seats}
						</div>
						{isBooked && <span>Занят</span>}
					</button>
				);
			})}
		</StyledTableGrid>
	);
};

const StyledTableGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
	gap: 20px;
	padding: 20px 0;

	.table {
		aspect-ratio: 1 / 1;
		border: none;
		border-radius: 15px;
		background: #f0f0f0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow:
			6px 6px 12px #bebebe,
			-6px -6px 12px #ffffff;
	}

	.selected {
		box-shadow:
			inset 4px 4px 8px #bebebe,
			inset -4px -4px 8px #ffffff;
		color: #ff4d4f;
		transform: scale(0.95);
	}

	.booked {
		opacity: 0.5;
		cursor: not-allowed;
		box-shadow: none;
		background: #e6e6e6;
	}

	.number {
		font-weight: 800;
		font-size: 1.2rem;
	}

	.seats {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 0.9rem;
		color: #666;
	}
`;
