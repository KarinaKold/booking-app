import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const SwitcherWrapper = styled.div`
	position: relative;
	cursor: pointer;
	font-size: 14px;
	color: #444;
	display: flex;
	align-items: center;
	gap: 5px;
`;

const Dropdown = styled.div`
	position: absolute;
	top: 100%;
	right: 0;
	background: white;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	padding: 8px 0;
	margin-top: 10px;
	z-index: 10;
	min-width: 120px;
`;

const LangOption = styled.div`
	padding: 8px 16px;
	transition: background 0.2s;
	&:hover {
		background: #f0f0f0;
		color: #ff4d4f;
	}
	${({ $active }) => $active && `font-weight: bold; color: #ff4d4f;`}
`;

export const LangSwitcher = () => {
	const { i18n } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);

	const languages = [
		{ code: 'ru', label: 'Русский' },
		{ code: 'en', label: 'English' },
	];

	const toggleDropdown = () => setIsOpen(!isOpen);

	const changeLanguage = (code) => {
		i18n.changeLanguage(code);
		setIsOpen(false);
	};

	return (
		<SwitcherWrapper onClick={toggleDropdown}>
			<span>{languages.find((l) => l.code === i18n.language)?.label || 'RU'}</span>
			<span>▼</span>
			{isOpen && (
				<Dropdown>
					{languages.map((lang) => (
						<LangOption
							key={lang.code}
							$active={i18n.language === lang.code}
							onClick={() => changeLanguage(lang.code)}
						>
							{lang.label}
						</LangOption>
					))}
				</Dropdown>
			)}
		</SwitcherWrapper>
	);
};
