import { FaInstagram, FaFacebookF, FaTelegramPlane, FaYoutube } from 'react-icons/fa';
import styled from 'styled-components';

const socialLinks = [
	{ id: 'inst', icon: <FaInstagram />, href: 'https://instagram.com' },
	{ id: 'fb', icon: <FaFacebookF />, href: 'https://facebook.com' },
	{ id: 'tg', icon: <FaTelegramPlane />, href: 'https://telegram.org' },
	{ id: 'yt', icon: <FaYoutube />, href: 'https://youtube.com' },
];

export const Socials = () => {
	return (
		<StyledSocials>
			{socialLinks.map((social) => (
				<a
					key={social.id}
					href={social.href}
					className="socialIcon"
					target="_blank"
					rel="noreferrer"
					aria-label={social.id}
				>
					{social.icon}
				</a>
			))}
		</StyledSocials>
	);
};

const StyledSocials = styled.div`
	display: flex;
	gap: 12px;

	.socialIcon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #2d2d2d;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 1.1rem;
		text-decoration: none;
		transition: all 0.3s ease;

		&:hover {
			background-color: #0ea5e9;
			transform: translateY(-3px);
		}
	}

	@media (max-width: 768px) {
		justify-content: center;
	}
`;
