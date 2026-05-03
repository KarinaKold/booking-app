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
		background: #f0f0f0;
		font-weight: 600;
		color: #444;
		cursor: pointer;
		transition: 0.2s;
		box-shadow:
			4px 4px 8px #bebebe,
			-4px -4px 8px #ffffff;

		&.active {
			background: #0ea5e9;
			color: white;
			box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.2);
		}
	}
`;
