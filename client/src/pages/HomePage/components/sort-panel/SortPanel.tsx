import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { DropdownButton } from '../../../../components';
import { SORT_OPTIONS } from './SortOptions';
import styled from 'styled-components';
import type { SortField, SortOption, SortOrder } from '../../types';

interface SortPanelProps {
	sortBy: SortField;
	sortOrder: SortOrder;
	onSortChange: (field: SortField, order: SortOrder) => void;
}

export const SortPanel = ({ sortBy, sortOrder, onSortChange }: SortPanelProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const activeOption =
		SORT_OPTIONS.find((opt) => opt.field === sortBy && opt.order === sortOrder) ||
		SORT_OPTIONS[0];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleOptionClick = (option: SortOption) => {
		onSortChange(option.field, option.order);
		setIsOpen(false);
	};

	return (
		<StyledSortPanel ref={dropdownRef}>
			<DropdownButton onClick={() => setIsOpen(!isOpen)}>
				<span className="icon">{activeOption.icon}</span>
				<span className="label">{activeOption.label}</span>
				<FaChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
			</DropdownButton>
			{isOpen && (
				<ul className="menu">
					{SORT_OPTIONS.map((option) => (
						<li
							key={option.id}
							className={option.id === activeOption.id ? 'active' : ''}
							onClick={() => handleOptionClick(option)}
						>
							{option.icon} {option.label}
						</li>
					))}
				</ul>
			)}
		</StyledSortPanel>
	);
};

const StyledSortPanel = styled.div`
	position: relative;
	display: flex;
	justify-content: flex-end;
	margin-bottom: 25px;
	z-index: 100;

	.icon {
		color: #0ea5e9;
		display: flex;
	}
	.label {
		flex-grow: 1;
		text-align: left;
	}

	.chevron {
		font-size: 12px;
		transition: transform 0.3s;
		&.open {
			transform: rotate(180deg);
		}
	}

	.menu {
		position: absolute;
		top: calc(100% + 10px);
		right: 0;
		background: #f0f0f0;
		border-radius: 15px;
		box-shadow:
			10px 10px 20px #bebebe,
			-10px -10px 20px #ffffff;
		list-style: none;
		padding: 10px;
		margin: 0;
		overflow: hidden;
		animation: fadeIn 0.2s ease-out;
	}

	li {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px 15px;
		border-radius: 10px;
		cursor: pointer;
		font-size: 14px;
		color: #666;
		transition: all 0.2s;

		&:hover {
			background: #e8e8e8;
			color: #0ea5e9;
		}

		&.active {
			color: #0ea5e9;
			font-weight: bold;
			background: #e0e0e0;
			box-shadow:
				inset 2px 2px 5px #bebebe,
				inset -2px -2px 5px #ffffff;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
`;
