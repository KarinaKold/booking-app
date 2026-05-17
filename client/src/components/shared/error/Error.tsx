import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Div = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 18px;
`;

export const Error = ({ error }: { error: string | null | undefined }) => {
	const { t } = useTranslation();
	return error ? (
		<Div>
			<h2>{t('common.error')}</h2>
			<div>{error}</div>
		</Div>
	) : null;
};
