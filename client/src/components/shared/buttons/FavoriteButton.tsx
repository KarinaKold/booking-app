import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styled from 'styled-components';
import { Button } from './Button';

interface FavoriteBtnProps {
	isFavorite: boolean;
	onClick: (e: React.MouseEvent) => void;
}

export const FavoriteButton = ({ isFavorite, onClick }: FavoriteBtnProps) => (
	<StyledFavorite onClick={onClick} aria-label="Favorite">
		{isFavorite ? (
			<FaHeart className="heart-full" />
		) : (
			<FaRegHeart className="heart-empty" />
		)}
	</StyledFavorite>
);

const StyledFavorite = styled(Button)`
	position: absolute;
	top: 12px;
	right: 12px;
	width: 36px;
	height: 36px;
	padding: 0;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.9);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;

	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

	&:hover {
		transform: scale(1.1);
		background: #fff;
	}

	svg {
		font-size: 18px;
		transition: transform 0.2s;
	}

	.heart-full {
		color: #ff4d4f;
	}
	.heart-empty {
		color: #333;
	}
`;
