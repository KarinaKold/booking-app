import { PaginationButton } from '../../../../components';
import {
	FaAngleDoubleLeft,
	FaAngleDoubleRight,
	FaAngleLeft,
	FaAngleRight,
} from 'react-icons/fa';
import styled from 'styled-components';

interface PaginationProps {
	className?: string;
	page: number;
	lastPage: number;
	setPage: (page: number) => void;
}

const PaginationContainer = ({ className, page, setPage, lastPage }: PaginationProps) => {
	const handleChangePage = (newPage: number): void => {
		setPage(newPage);

		setTimeout(() => {
			const element = document.getElementById('restaurant-list-start');
			if (element) {
				element.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}
		}, 0);
	};

	return (
		<div className={className}>
			<PaginationButton disabled={page === 1} onClick={() => handleChangePage(1)}>
				<FaAngleDoubleLeft />
			</PaginationButton>
			<PaginationButton
				disabled={page === 1}
				onClick={() => handleChangePage(page - 1)}
			>
				<FaAngleLeft />
			</PaginationButton>
			<CurrentPage className="current-page">{page}</CurrentPage>
			<PaginationButton
				disabled={page === lastPage}
				onClick={() => handleChangePage(page + 1)}
			>
				<FaAngleRight />
			</PaginationButton>
			<PaginationButton
				disabled={page === lastPage}
				onClick={() => handleChangePage(lastPage)}
			>
				<FaAngleDoubleRight />
			</PaginationButton>
		</div>
	);
};

const CurrentPage = styled.div`
	min-width: 60px;
	height: 40px;
	font-size: 18px;
	font-weight: 700;
	line-height: 38px;
	text-align: center;
	border-radius: 10px;
	background: #fff;
	color: #333;
`;

export const Pagination = styled(PaginationContainer)`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 30px 0;
	width: 100%;
	gap: 20px;
`;
