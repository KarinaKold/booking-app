import { FaInstagram, FaFacebookF, FaTelegramPlane, FaYoutube } from 'react-icons/fa';
import styles from '../Footer.module.css';

const socialLinks = [
	{ id: 'inst', icon: <FaInstagram />, href: 'https://instagram.com' },
	{ id: 'fb', icon: <FaFacebookF />, href: 'https://facebook.com' },
	{ id: 'tg', icon: <FaTelegramPlane />, href: 'https://telegram.org' },
	{ id: 'yt', icon: <FaYoutube />, href: 'https://youtube.com' },
];

export const Socials = () => {
	return (
		<div className={styles.socials}>
			{socialLinks.map((social) => (
				<a
					key={social.id}
					href={social.href}
					className={styles.socialIcon}
					target="_blank"
					rel="noreferrer"
					aria-label={social.id}
				>
					{social.icon}
				</a>
			))}
		</div>
	);
};
