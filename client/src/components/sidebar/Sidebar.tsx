import { useState, useEffect } from 'react';
import { FaFilter, FaUndoAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { request } from '../../utils/request';
import type { RestaurantFilters } from '../../pages/HomePage/types';
import type { ServerResponse } from '../../types';
import styled from 'styled-components';

interface SidebarProps {
	onFilterChange: (filters: RestaurantFilters) => void;
	amount: number;
	loading: boolean;
}

interface Metadata {
	cuisines: string[];
}

export const Sidebar = ({ onFilterChange, amount, loading }: SidebarProps) => {
	const { t } = useTranslation();
	const initialFilters: RestaurantFilters = {
		cuisines: [],
		minRating: 0,
		openNow: false,
		hasBarCard: false,
	};

	const [filters, setFilters] = useState<RestaurantFilters>(initialFilters);
	const [metadata, setMetadata] = useState<Metadata>({ cuisines: [] });

	useEffect(() => {
		request<ServerResponse<Metadata>>('/restaurants/filters/metadata').then(
			({ data }) => {
				if (data) setMetadata(data);
			},
		);
	}, []);

	useEffect(() => {
		onFilterChange(filters);
	}, [filters]);

	const handleReset = () => {
		setFilters(initialFilters);
	};

	const toggleCuisine = (cuisine: string) => {
		setFilters((prev) => ({
			...prev,
			cuisines: prev.cuisines.includes(cuisine)
				? prev.cuisines.filter((c) => c !== cuisine)
				: [...prev.cuisines, cuisine],
		}));
	};

	return (
		<StyledSidebar>
			<div className="header">
				<div className="title">
					<FaFilter /> <span>{t('sidebar.title')}</span>
				</div>
				<button
					className="reset-btn"
					onClick={handleReset}
					title={t('sidebar.reset_title')}
				>
					<FaUndoAlt />
				</button>
			</div>
			<ResultsBadge>
				{loading
					? t('sidebar.loading')
					: t('sidebar.found_count', { count: amount })}
			</ResultsBadge>
			<div>
				<FilterSection>
					<h4>{t('sidebar.cuisine')}</h4>
					<div className="cuisine-list">
						{metadata.cuisines.map((c) => (
							<CheckboxLabel key={c}>
								<input
									type="checkbox"
									checked={filters.cuisines.includes(c)}
									onChange={() => toggleCuisine(c)}
								/>{' '}
								{c}
							</CheckboxLabel>
						))}
					</div>
				</FilterSection>
				<FilterSection>
					<h4>{t('sidebar.rating')}</h4>
					<StyledSelect
						value={filters.minRating}
						onChange={({ target }) =>
							setFilters({ ...filters, minRating: Number(target.value) })
						}
					>
						<option value="0">{t('sidebar.any_rating')}</option>
						<option value="3">
							{t('sidebar.from_rating', { rating: '3.0' })}
						</option>
						<option value="4">
							{t('sidebar.from_rating', { rating: '4.0' })}
						</option>
						<option value="4.5">
							{t('sidebar.from_rating', { rating: '4.5' })}
						</option>
					</StyledSelect>
				</FilterSection>
				<FilterSection className="switches">
					<CheckboxLabel>
						<input
							type="checkbox"
							checked={filters.openNow}
							onChange={(e) =>
								setFilters({ ...filters, openNow: e.target.checked })
							}
						/>
						{t('sidebar.open_now')}
					</CheckboxLabel>
					<CheckboxLabel>
						<input
							type="checkbox"
							checked={filters.hasBarCard}
							onChange={(e) =>
								setFilters({ ...filters, hasBarCard: e.target.checked })
							}
						/>{' '}
						{t('sidebar.bar_card')}
					</CheckboxLabel>
				</FilterSection>
			</div>
		</StyledSidebar>
	);
};

const FilterSection = styled.section`
	margin-bottom: 24px;

	h4 {
		margin-bottom: 12px;
		font-size: 15px;
		font-weight: 700;
		color: var(--color);
		text-transform: uppercase;
		letter-spacing: 1px;
	}
`;

const StyledSelect = styled.select`
	width: 100%;
	padding: 10px 12px;
	background: #f8f9fa;
	border: 1px solid #eee;
	border-radius: 12px;
	font-size: 14px;
	color: #333;
	outline: none;
	cursor: pointer;
	transition: all 0.2s ease;

	&:focus {
		border-color: #0ea5e9;
		background: #fff;
		box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
	}
`;

const CheckboxLabel = styled.label`
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
	font-size: 15px;
	color: #555;
	padding: 4px 0;
	transition: color 0.2s;

	&:hover {
		color: #0ea5e9;
	}

	input[type='checkbox'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
		accent-color: #0ea5e9;
	}
`;

const ResultsBadge = styled.div`
	font-size: 13px;
	font-weight: 600;
	color: #0ea5e9;
	background: #eef6ff;
	padding: 8px 12px;
	border-radius: 10px;
	margin-bottom: 5px;
	display: inline-block;
`;

const StyledSidebar = styled.aside`
	width: 280px;
	padding: 24px;
	background: var(--card-background);
	box-shadow: var(--nm-shadow-flat);
	border-radius: 20px;
	height: fit-content;
	border: var(--select-border);
	transition: all 0.3s ease;

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.title {
		display: flex;
		align-items: center;
		gap: 10px;
		font-weight: 700;
		font-size: 19px;
		color: var(--color);
	}

	.cuisine-list {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.reset-btn {
		background: #f5f5f5;
		border: none;
		width: 32px;
		height: 32px;
		border-radius: 8px;
		cursor: pointer;
		color: #888;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;

		&:hover {
			background: #ffebee;
			color: #ff5252;
		}
	}

	.switches {
		padding-top: 20px;
		border-top: 2px solid #f8f8f8;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
`;
