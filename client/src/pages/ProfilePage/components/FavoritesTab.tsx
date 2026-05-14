import { useTranslation } from 'react-i18next';
import { Card } from '../../../pages/HomePage/components';
import type { Restaurant } from '../../../types';

interface FavoritesTabProps {
	restaurants: Restaurant[];
	onFavorite: (id: string | undefined) => Promise<void>;
}

export const FavoritesTab = ({ restaurants, onFavorite }: FavoritesTabProps) => {
	const { t } = useTranslation();

	if (!restaurants.length) {
		return <p>{t('profile.no_favorites')}</p>;
	}

	return (
		<>
			{restaurants.map((rest) => (
				<Card
					key={rest.id || rest._id}
					id={rest.id || rest._id || ''}
					title={rest.name}
					imageUrl={rest.images?.[0]}
					description={rest.description}
					rating={rest.rating}
					isFavorite={true}
					handleFavorite={() => onFavorite(rest.id || rest._id)}
				/>
			))}
		</>
	);
};
