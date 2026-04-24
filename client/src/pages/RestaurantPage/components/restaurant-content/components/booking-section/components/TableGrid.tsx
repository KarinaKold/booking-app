import { FaUserFriends } from 'react-icons/fa';
import styles from './TableGrid.module.css';

interface Table {
	_id: string;
	number: number;
	seats: number;
}

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
		<div className={styles.grid}>
			{tables.map((table) => {
				// Вычисляем доступность стола
				const isBusy = busyTableIds.includes(table.number);
				const isSelected = selectedId === table.number;

				return (
					<button
						key={table._id}
						type="button"
						disabled={isBusy || isSelectionDisabled}
						className={`
                            ${styles.table}
                            ${isSelected ? styles.selected : ''}
                            ${isBusy ? styles.occupied : ''}
                        `}
						onClick={() => onSelect(table.number)}
					>
						<span className={styles.number}>№{table.number}</span>
						<div className={styles.seats}>
							<FaUserFriends /> {table.seats}
						</div>
						{isBusy && <span className={styles.statusLabel}>Занят</span>}
					</button>
				);
			})}
		</div>
	);
};
