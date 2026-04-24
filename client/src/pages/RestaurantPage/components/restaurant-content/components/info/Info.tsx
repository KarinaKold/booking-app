import { useTranslation } from 'react-i18next';
import {
	FaStar,
	FaMapMarkerAlt,
	FaClock,
	FaUtensils,
	FaGlassMartiniAlt,
} from 'react-icons/fa';
import styled from 'styled-components';

export const Info = ({
	name,
	rating,
	address,
	workingHours,
	cuisine,
	hasBarCard,
	description,
}) => {
	const { t } = useTranslation();
	return (
		<StyledInfo>
			<div className="info">
				<div className="header-main">
					<h2>{name}</h2>
					<div className="rating-badge">
						<FaStar /> {Number(rating || 0).toFixed(1)}
					</div>
				</div>
				<div className="meta">
					<span>
						<FaMapMarkerAlt className="icon" /> {address}
					</span>
					<span>
						<FaClock className="icon" /> {workingHours}
					</span>
					<span>
						<FaUtensils className="icon" /> {cuisine}
					</span>
					{hasBarCard && (
						<span>
							<FaGlassMartiniAlt className="icon" />
							{t('restaurant.bar_card')}
						</span>
					)}
				</div>
			</div>
			<div className="about-section">
				<h3>{t('restaurant.about')}</h3>
				<p className="description-text">{description}</p>
			</div>
		</StyledInfo>
	);
};

const StyledInfo = styled.section`
	.info h2 {
		margin: 0 0 20px 0;
		font-size: 2.2rem;
		color: #333;
	}

	.header-main {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20px;
	}

	.rating-badge {
		font-size: 18px;
		font-weight: 800;
		color: #ffb400;
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 25px;
	}

	.meta span {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 1.1rem;
		color: #555;
	}

	.about-section h3 {
		margin-bottom: 12px;
		font-size: 1.4rem;
	}

	.description-text {
		font-size: 18px;
		white-space: pre-line;
		line-height: 1.5;
		color: #333;
	}
`;
