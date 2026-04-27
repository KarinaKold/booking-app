import type { ChangeEvent } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Input } from '../../../../components';
import styled from 'styled-components';

interface SearchProps {
	className?: string;
	searchPhrase: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const SearchContainer = ({ className, searchPhrase, onChange }: SearchProps) => {
	return (
		<div className={className} id="restaurant-list-start">
			<Input
				value={searchPhrase}
				placeholder="Введите название..."
				onChange={onChange}
			/>
			<div className="search-icon-wrapper">
				<FaSearch size="18px" color="#999" />
			</div>
		</div>
	);
};

export const Search = styled(SearchContainer)`
	display: flex;
	position: relative;
	width: 340px;
	height: 40px;
	margin: 10px auto 0;

	& > input {
		padding: 10px 35px 10px 10px;
		width: 100%;
		box-sizing: border-box;
	}

	& .search-icon-wrapper {
		position: absolute;
		right: 12px;
		transform: translateY(35%);
		display: flex;
		align-items: center;
		pointer-events: none;
		opacity: 0.7;
	}
`;
