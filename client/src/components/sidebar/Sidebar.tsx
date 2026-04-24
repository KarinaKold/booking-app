import { useState, useEffect } from 'react';
import { request } from '../../utils/request';
import styles from './Sidebar.module.css';
import { FaFilter, FaUndoAlt } from 'react-icons/fa';

export const Sidebar = ({ onFilterChange, amount, loading }) => {
	const initialFilters = {
		cuisines: [],
		minRating: 0,
		openNow: false,
		hasBarCard: false,
	};

	const [filters, setFilters] = useState(initialFilters);
	const [metadata, setMetadata] = useState({ cuisines: [] });

	useEffect(() => {
		request('/restaurants/filters/metadata').then(({ data }) => {
			if (data) setMetadata(data);
		});
	}, []);

	useEffect(() => {
		onFilterChange(filters);
	}, [filters]);

	const handleReset = () => {
		setFilters(initialFilters);
	};

	const toggleCuisine = (cuisine) => {
		setFilters((prev) => ({
			...prev,
			cuisines: prev.cuisines.includes(cuisine)
				? prev.cuisines.filter((c) => c !== cuisine)
				: [...prev.cuisines, cuisine],
		}));
	};

	return (
		<aside className={styles.sidebar}>
			<div className={styles.header}>
				<div className={styles.title}>
					<FaFilter /> <span>Фильтры</span>
				</div>
				<button
					className={styles.resetButton}
					onClick={handleReset}
					title="Сбросить все"
				>
					<FaUndoAlt />
				</button>
			</div>
			<div className={styles.resultsInfo}>
				{loading ? 'Загрузка...' : `Найдено: ${amount}`}
			</div>
			<div className={styles.filterGroups}>
				<section className={styles.section}>
					<h4>Кухня</h4>
					<div className={styles.cuisineList}>
						{metadata.cuisines.map((c) => (
							<label key={c} className={styles.checkboxLabel}>
								<input
									type="checkbox"
									checked={filters.cuisines.includes(c)}
									onChange={() => toggleCuisine(c)}
								/>{' '}
								{c}
							</label>
						))}
					</div>
				</section>

				<section className={styles.section}>
					<h4>Рейтинг</h4>
					<select
						className={styles.select}
						value={filters.minRating}
						onChange={({ target }) =>
							setFilters({ ...filters, minRating: Number(target.value) })
						}
					>
						<option value="0">Любой</option>
						<option value="3">От 3.0 ★</option>
						<option value="4">От 4.0 ★</option>
						<option value="4.5">От 4.5 ★</option>
					</select>
				</section>
				<section className={styles.section}>
					<label className={styles.checkboxLabel}>
						<input
							type="checkbox"
							checked={filters.openNow}
							onChange={(e) =>
								setFilters({ ...filters, openNow: e.target.checked })
							}
						/>{' '}
						Открыто сейчас
					</label>
					<label className={styles.checkboxLabel}>
						<input
							type="checkbox"
							checked={filters.hasBarCard}
							onChange={(e) =>
								setFilters({ ...filters, hasBarCard: e.target.checked })
							}
						/>{' '}
						Барная карта
					</label>
				</section>
			</div>
		</aside>
	);
};

// interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
// 	label?: string;
// 	options: string[];
// 	placeholder?: string;
// }

// export const Select = ({ label, options, placeholder, ...props }: SelectProps) => (
// 	<div className={styles.wrapper}>
// 		{label && <label className={styles.label}>{label}</label>}
// 		<select className={styles.select} {...props}>
// 			{placeholder && <option value="">{placeholder}</option>}
// 			{options.map((opt) => (
// 				<option key={opt} value={opt}>
// 					{opt}
// 				</option>
// 			))}
// 		</select>
// 	</div>
// );


// interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
// 	label: string;
// 	icon?: React.ReactNode;
// }

// export const Checkbox = ({ label, icon, ...props }: CheckboxProps) => (
// 	<label className={styles.checkboxLabel}>
// 		<input type="checkbox" className={styles.input} {...props} />
// 		{icon}
// 		<span>{label}</span>
// 	</label>
// );


// export const FilterSection = ({
// 	title,
// 	children,
// }: {
// 	title: string;
// 	children: React.ReactNode;
// }) => (
// 	<div className={styles.section}>
// 		<h4 className={styles.sectionTitle}>{title}</h4>
// 		{children}
// 	</div>
// );


// export const Sidebar = ({ filters, setFilters, options }: SidebarProps) => {
	// const { t } = useTranslation();

// 	return (
// 		<aside className={styles.sidebar}>
// 			<FilterSection title={t('sidebar.location')}>
// 				<Select
// 					options={options.cities}
// 					value={filters.city}
// 					onChange={(e) => setFilters({ ...filters, city: e.target.value })}
// 					placeholder={t('sidebar.all_cities')}
// 				/>
// 			</FilterSection>
// 			<FilterSection title={t('sidebar.cuisine')}>
// 				<Select
// 					options={options.cuisines}
// 					value={filters.cuisine}
// 					onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
// 					placeholder={t('sidebar.any_cuisine')}
// 				/>
// 			</FilterSection>
// 			<FilterSection title={t('sidebar.additional')}>
// 				<Checkbox
// 					label={t('sidebar.bar_card')}
// 					// icon={<Wine size={16} />}
// 					checked={filters.hasBar}
// 					onChange={(e) => setFilters({ ...filters, hasBar: e.target.checked })}
// 				/>
// 			</FilterSection>
// 		</aside>
// 	);
// };
