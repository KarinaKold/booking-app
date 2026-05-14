import { useTranslation } from 'react-i18next';
import { Card } from '../../../pages/HomePage/components';
import type { Restaurant } from '../../../types';

interface OwnedTabProps {
	restaurants: Restaurant[];
	userFavorites: string[];
	onFavorite: (id: string | undefined) => Promise<void>;
}

export const OwnedTab = ({ restaurants, userFavorites, onFavorite }: OwnedTabProps) => {
	const { t } = useTranslation();

	if (!restaurants.length) {
		return <p>{t('profile.no_owned')}</p>;
	}

	return (
		<>
			{restaurants.map((rest) => {
				const restaurantId = rest.id || rest._id || '';
				return (
					<Card
						key={restaurantId}
						id={restaurantId}
						title={rest.name}
						imageUrl={rest.images?.[0]}
						description={rest.description}
						rating={rest.rating}
						isFavorite={userFavorites.includes(restaurantId)}
						handleFavorite={() => onFavorite(restaurantId)}
					/>
				);
			})}
		</>
	);
};
