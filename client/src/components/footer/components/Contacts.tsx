import { useTranslation } from 'react-i18next';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import styled from 'styled-components';

const CONTACTS_LIST = {
	address: 'footer.address',
	phone: '+7 (999) 123-45-67',
	email: 'info@restsurf.com',
};

export const Contacts = () => {
	const { t } = useTranslation();

	return (
		<StyledContacts>
			<h4 className="title">{t('footer.contacts_title')}</h4>
			<ul className="list">
				<li className="listItem">
					<FaMapMarkerAlt className="contactIcon" />
					<span>{t(CONTACTS_LIST.address)}</span>
				</li>
				<li className="listItem">
					<FaPhoneAlt className="contactIcon" />
					<span>{CONTACTS_LIST.phone}</span>
				</li>
				<li className="listItem">
					<FaEnvelope className="contactIcon" />
					<span>{CONTACTS_LIST.email}</span>
				</li>
			</ul>
		</StyledContacts>
	);
};

const StyledContacts = styled.div`
	.title {
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		color: #fff;
	}

	.list {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.listItem {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		color: #aaa;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.contactIcon {
		color: #0ea5e9;
		margin-top: 3px;
		flex-shrink: 0;
	}

	@media (max-width: 768px) {
		.listItem {
			justify-content: center;
		}
	}
`;
