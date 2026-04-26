import { useTranslation } from 'react-i18next';
import { FaCode } from 'react-icons/fa';
import { Contacts, Socials } from './components';
import { MAIN_TITLE } from '../../constants/titles';
import styled from 'styled-components';

const FooterContainer = ({ className }: { className?: string }) => {
	const { t } = useTranslation();
	const currentYear = new Date().getFullYear();

	return (
		<footer className={className}>
			<div className="container">
				<div className="info">
					<h2 className="logo">{MAIN_TITLE}</h2>
					<p className="description">{t('footer.description')}</p>
					<Socials />
				</div>
				<Contacts />
			</div>
			<div className="bottom">
				<div className="container">
					<p>
						© {currentYear} {MAIN_TITLE}. {t('footer.rights')}
					</p>
					<div className="creator">
						<FaCode className="creatorIcon" />
						<span>created by</span>
						<a
							href="https://github.com/KarinaKold"
							target="_blank"
							rel="noreferrer"
							className="authorLink"
						>
							karinakold
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export const Footer = styled(FooterContainer)`
	background-color: #18181a;
	color: #ffffff;
	padding-top: 20px;
	margin-top: auto;
	width: 100%;

	.container {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 1.5rem;
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 40px;
	}

	.logo {
		color: #0ea5e9;
		font-size: 1.5rem;
		font-weight: 800;
		margin-bottom: 1rem;
	}

	.description {
		color: #aaa;
		font-style: inherit;
		font-size: 0.8rem;
		line-height: 1.6;
		max-width: 400px;
		margin-bottom: 1.5rem;
	}

	.bottom {
		border-top: 1px solid #333;
		margin-top: 40px;
		padding: 10px 0;
		text-align: center;
		color: #666;
		font-size: 0.85rem;
	}

	.creator {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: #888;
	}

	.creatorIcon {
		color: gray;
	}

	.authorLink {
		color: #fff;
		text-decoration: none;
		font-weight: 600;
		transition: color 0.2s;
	}
	.authorLink:hover {
		color: gray;
	}

	@media (max-width: 768px) {
		.container {
			grid-template-columns: 1fr;
			text-align: center;
		}

		.description,
		.logo {
			margin-left: auto;
			margin-right: auto;
		}
	}
`;
