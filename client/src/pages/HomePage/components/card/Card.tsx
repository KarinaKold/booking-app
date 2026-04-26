import { useNavigate } from 'react-router';
import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';
import { BookButton, FavoriteButton } from '../../../../components';

interface CardProps {
	id: string;
	title: string;
	imageUrl: string;
	description: string;
	rating: number;
	isFavorite?: boolean;
	handleFavorite?: (id: string) => void;
}

export const Card = ({
	id,
	title,
	imageUrl,
	description,
	rating,
	isFavorite = false,
	handleFavorite,
}: CardProps) => {
	const navigate = useNavigate();

	const handleBookClick = () => {
		navigate(`/rest/${id}`);
	};

	const onFavoriteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		handleFavorite?.(id);
	};

	return (
		<CardContainer>
			<ImageWrapper>
				<CardImage src={imageUrl} alt={title} />
				<FavoriteButton isFavorite={isFavorite} onClick={onFavoriteClick} />
			</ImageWrapper>
			<Content>
				<Header>
					<Title title={title}>{title}</Title>
					<Rating>
						<FaStar />
						<span>{rating}</span>
					</Rating>
				</Header>
				<Description>{description}</Description>
				<Footer>
					<BookButton onClick={handleBookClick}>Забронировать</BookButton>
				</Footer>
			</Content>
		</CardContainer>
	);
};

const CardContainer = styled.article`
	position: relative;
	background: #fff;
	border-radius: 16px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	overflow: hidden;
	width: 300px;
	display: flex;
	flex-direction: column;
	transition: transform 0.2s;

	&:hover {
		transform: translateY(-4px);
	}
`;

const ImageWrapper = styled.div`
	position: relative;
	height: 180px;
	width: 100%;
`;

const CardImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
`;

const Content = styled.div`
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex-grow: 1;
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Title = styled.h3`
	margin: 0;
	font-size: 1.15rem;
	font-weight: 700;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	color: #222;
`;

const Rating = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	font-weight: 600;
	font-size: 0.95rem;

	svg {
		color: #ffc107;
	}
`;

const Description = styled.p`
	font-size: 0.85rem;
	color: #666;
	line-height: 1.4;
	/* Эффект многоточия для 2-х строк */
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	height: 2.4rem;
	margin: 0;
`;

const Footer = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: auto;
	padding-top: 10px;
`;
