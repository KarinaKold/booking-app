import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/shared/buttons/Button';
import styled from 'styled-components';

export const NotFoundPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<Container>
			<ContentWrapper>
				<Title>{t('404.title')}</Title>
				<Description>{t('404.description')}</Description>
				<Button onClick={() => navigate('/')}>{t('404.backHome')}</Button>
			</ContentWrapper>
			<svg viewBox="0 0 1440 320" preserveAspectRatio="none">
				<path
					fill="#0ea5e9"
					d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
				/>
			</svg>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	width: 100%;

	svg {
		width: 100%;
		display: block;
		margin-top: auto;
		margin-bottom: -1px;
		height: auto;
		min-height: 150px;
		max-height: 300px;
	}
`;

const ContentWrapper = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px;
	margin-bottom: 2rem;
`;

const Title = styled.h1`
	font-size: 2.25rem;
	line-height: 2.5rem;
	font-weight: 700;
`;

const Description = styled.p`
	font-size: 1.25rem;
	padding-top: 1rem;
	padding-bottom: 2rem;
	margin: 0;
	text-align: center;
`;
