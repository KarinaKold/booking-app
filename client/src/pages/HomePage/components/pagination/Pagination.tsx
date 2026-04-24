import styled from 'styled-components';
import { Button } from '../../../../components/buttons/Button';
import {
	FaAngleDoubleLeft,
	FaAngleDoubleRight,
	FaAngleLeft,
	FaAngleRight,
} from 'react-icons/fa';

const PaginationContainer = ({ className, page, setPage, lastPage }) => {
	const handleChangePage = (newPage) => {
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
			<Button disabled={page === 1} onClick={() => handleChangePage(1)}>
				<FaAngleDoubleLeft />
			</Button>
			<Button disabled={page === 1} onClick={() => handleChangePage(page - 1)}>
				<FaAngleLeft />
			</Button>

			<div className="current-page">{page}</div>

			<Button
				disabled={page === lastPage}
				onClick={() => handleChangePage(page + 1)}
			>
				<FaAngleRight />
			</Button>
			<Button
				disabled={page === lastPage}
				onClick={() => handleChangePage(lastPage)}
			>
				<FaAngleDoubleRight />
			</Button>
		</div>
	);
};

export const Pagination = styled(PaginationContainer)`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 30px 0;
	width: 100%;
	gap: 20px;

	& button {
		margin: 0;
		padding: 0;
		width: 40px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 18px;
	}

	& .current-page {
		min-width: 60px;
		height: 40px;
		font-size: 18px;
		font-weight: 700;
		line-height: 38px;
		text-align: center;
		border-radius: 10px;
		background: #fff;
		color: #333;
	}
`;
