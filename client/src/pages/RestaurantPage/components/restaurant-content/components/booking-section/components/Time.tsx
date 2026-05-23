import styled from 'styled-components';

interface TimeGridProps {
	slots: string[];
	selectedTime: string | null;
	onSelect: (time: string) => void;
}

export const Time = ({ slots, selectedTime, onSelect }: TimeGridProps) => {
	return (
		<StyledTime>
			{slots.map((time) => (
				<button
					key={time}
					type="button"
					className={selectedTime === time ? 'active' : ''}
					onClick={() => onSelect(time)}
				>
					{time}
				</button>
			))}
		</StyledTime>
	);
};

const StyledTime = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
	gap: 12px;
	margin: 20px 0;

	button {
		padding: 12px;
		border: none;
		border-radius: 10px;
		background: var(--card-background);
		color: var(--color-muted);
		font-weight: 600;
		cursor: pointer;
		transition: 0.2s;
		box-shadow: var(--nm-shadow-flat);

		&.active {
			background: #0ea5e9;
			color: white;
			box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.2);
		}
	}
`;
