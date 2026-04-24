import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Calendar, TableGrid, Time } from './components';

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
}) => {
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
	// flex: 1;
	min-width: 0;

	.controls {
		margin-bottom: 40px;
	}

	.tables {
		margin-top: 20px;
	}
`;
