import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Calendar, TableGrid, Time } from './components';
import type { Table } from '../../../../../HomePage/types';

interface BookingSectionProps {
	selectedDate: Date;
	onDateChange: (date: Date) => void;
	availableDates: Date[];
	timeSlots: string[];
	selectedTime: string | null;
	onTimeSelect: (time: string) => void;
	tables: Table[];
	busyTableIds: number[];
	selectedTable: number | null;
	onTableSelect: (tableNumber: number) => void;
}

export const BookingSection = ({
	selectedDate,
	onDateChange,
	availableDates,
	timeSlots,
	selectedTime,
	onTimeSelect,
	tables,
	busyTableIds,
	selectedTable,
	onTableSelect,
}: BookingSectionProps) => {
	const { t } = useTranslation();

	return (
		<StyledSection>
			<section className="controls">
				<h3>{t('restaurant.select_datetime')}</h3>
				<Calendar
					selectedDate={selectedDate}
					onDateChange={onDateChange}
					availableDates={availableDates}
				/>
				<Time
					slots={timeSlots}
					selectedTime={selectedTime}
					onSelect={onTimeSelect}
				/>
			</section>
			<section className="tables">
				<h3>{t('restaurant.choose_table')}</h3>
				<TableGrid
					tables={tables}
					busyTableIds={busyTableIds}
					selectedId={selectedTable}
					onSelect={onTableSelect}
					isSelectionDisabled={!selectedTime}
				/>
			</section>
		</StyledSection>
	);
};

const StyledSection = styled.div`
	min-width: 0;

	.controls {
		margin-bottom: 40px;
	}

	.tables {
		margin-top: 20px;
	}
`;
