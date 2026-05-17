import { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
	FaCalendarCheck,
	FaHeart,
	FaUtensils,
	FaUsers,
	FaPlusCircle,
} from 'react-icons/fa';
import { useGetConfirmation } from '../../providers';
import { useProfileData } from '../../hooks';
import { BookingsTab, FavoritesTab, OwnedTab } from './components';
import { Loader, TabButton } from '../../components';
import { Error } from '../../components/shared/error/Error';

type TabType = 'bookings' | 'favorites' | 'owned';

const ProfileLayout = styled.div`
	display: flex;
	max-width: 1400px;
	margin: 30px auto;
	gap: 40px;
	padding: 0 20px;
	align-items: flex-start;

	@media (max-width: 900px) {
		flex-direction: column;
	}
`;

const Sidebar = styled.aside`
	width: 280px;
	min-width: 280px;
	flex-shrink: 0;
	background: #fff;
	border-radius: 25px;
	padding: 20px;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
	position: sticky;
	top: 100px;

	@media (max-width: 900px) {
		width: 100%;
		position: static;
	}
`;

const ContentArea = styled.section`
	flex-grow: 1;
	width: 100%;
	h2 {
		margin-bottom: 25px;
		font-size: 24px;
		color: #1a1a1a;
	}
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 25px;
`;

export const ProfilePage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { getConfirmation } = useGetConfirmation();
	const {
		bookings,
		favoriteRestaurants,
		ownedRestaurants,
		loading,
		error,
		isAdmin,
		isGuest,
		isModerator,
		userFavorites,
		handleCancel,
		handleFavorite,
	} = useProfileData(getConfirmation, t);

	const [activeTab, setActiveTab] = useState<TabType>('bookings');

	if (isGuest && !loading) navigate('/');

	const renderContent = () => {
		if (isGuest) {
			return <p>{t('profile.unauthorized_message')}</p>;
		}

		if (loading) return <Loader />;
		if (error) {
			return <Error>{error}</Error>;
		}

		switch (activeTab) {
			case 'bookings':
				return (
					<Grid>
						<BookingsTab bookings={bookings} onCancel={handleCancel} />
					</Grid>
				);
			case 'favorites':
				return (
					<Grid>
						<FavoritesTab
							restaurants={favoriteRestaurants}
							onFavorite={handleFavorite}
						/>
					</Grid>
				);
			case 'owned':
				return (
					<Grid>
						<OwnedTab
							restaurants={ownedRestaurants}
							userFavorites={userFavorites}
							onFavorite={handleFavorite}
						/>
					</Grid>
				);
			default:
				return null;
		}
	};

	return (
		<ProfileLayout>
			<Sidebar>
				<TabButton
					$active={activeTab === 'bookings'}
					onClick={() => setActiveTab('bookings')}
				>
					<FaCalendarCheck /> {t('profile.my_bookings')}
				</TabButton>
				<TabButton
					$active={activeTab === 'favorites'}
					onClick={() => setActiveTab('favorites')}
				>
					<FaHeart /> {t('profile.favorites')}
				</TabButton>
				{(isAdmin || isModerator) && (
					<TabButton
						$active={activeTab === 'owned'}
						onClick={() => setActiveTab('owned')}
					>
						<FaUtensils /> {t('profile.my_restaurants')}
					</TabButton>
				)}
				<hr
					style={{
						margin: '15px 0',
						border: 'none',
						borderTop: '1px solid #eee',
					}}
				/>
				{isAdmin && (
					<TabButton onClick={() => navigate('/users')}>
						<FaUsers /> {t('profile.users')}
					</TabButton>
				)}
				{(isAdmin || isModerator) && (
					<TabButton $isAction onClick={() => navigate('/rest')}>
						<FaPlusCircle /> {t('profile.add_restaurant')}
					</TabButton>
				)}
			</Sidebar>
			<ContentArea>{renderContent()}</ContentArea>
		</ProfileLayout>
	);
};
