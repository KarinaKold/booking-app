import { useTranslation } from 'react-i18next';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import styles from '../Footer.module.css';

const CONTACTS_LIST = {
	address: 'footer.address',
	phone: '+7 (999) 123-45-67',
	email: 'info@restsurf.com',
};

export const Contacts = () => {
	const { t } = useTranslation();

	return (
		<div className={styles.contacts}>
			<h4 className={styles.title}>{t('footer.contacts_title')}</h4>
			<ul className={styles.list}>
				<li className={styles.listItem}>
					<FaMapMarkerAlt className={styles.contactIcon} />
					<span>{t(CONTACTS_LIST.address)}</span>
				</li>
				<li className={styles.listItem}>
					<FaPhoneAlt className={styles.contactIcon} />
					<span>{CONTACTS_LIST.phone}</span>
				</li>
				<li className={styles.listItem}>
					<FaEnvelope className={styles.contactIcon} />
					<span>{CONTACTS_LIST.email}</span>
				</li>
			</ul>
		</div>
	);
};
