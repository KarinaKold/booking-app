import { useTranslation } from 'react-i18next';
import { FaCode } from 'react-icons/fa';
import { Contacts, Socials } from './components';
import { MAIN_TITLE } from '../../constants/titles';
import styles from './Footer.module.css';

export const Footer = () => {
	const { t } = useTranslation();
	const currentYear = new Date().getFullYear();

	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.info}>
					<h2 className={styles.logo}>{MAIN_TITLE}</h2>
					<p className={styles.description}>{t('footer.description')}</p>
					<Socials />
				</div>
				<Contacts />
			</div>
			<div className={styles.bottom}>
				<div className={styles.container}>
					<p>
						© {currentYear} {MAIN_TITLE}. {t('footer.rights')}
					</p>
					<div className={styles.creator}>
						<FaCode className={styles.creatorIcon} />
						<span>created by</span>
						<a
							href="https://github.com/KarinaKold"
							target="_blank"
							rel="noreferrer"
							className={styles.authorLink}
						>
							karinakold
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

// const FooterContainer = ({ className }) => {
// 	const [city, setCity] = useState('');
// 	const [temperature, setTemperature] = useState('');
// 	const [weather, setWeather] = useState('');

// 	useEffect(() => {
// 		fetch(
// 			'https://api.openweathermap.org/data/2.5/weather?q=Moscow&units=metric&lang=ru&appid=acd4f346c669d7400f4dbbeb7f1350e0',
// 		)
// 			.then((res) => res.json())
// 			.then(({ name, main, weather }) => {
// 				setCity(name);
// 				setTemperature(Math.round(main.temp));
// 				setWeather(weather[0].description);
// 			});
// 	}, []);

// 	return (
// 		<div className={className}>
// 			<div>
// 				<div>Блог веб-разработчика</div>
// 				<div>web@developer.ru</div>
// 			</div>
// 			<div>
// 				<div>
// 					{city},{' '}
// 					{new Date().toLocaleString('ru', { day: 'numeric', month: 'long' })}
// 				</div>
// 				<div>
// 					{temperature} градусов, {weather}
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export const Footer = () => {

// const [city, setCity] = useState('');
// const [temperature, setTemperature] = useState('');
// const [weather, setWeather] = useState('');

// useEffect(() => {
// 	fetch(
// 		'https://api.openweathermap.org/data/2.5/weather?q=Moscow&units=metric&lang=ru&appid=acd4f346c669d7400f4dbbeb7f1350e0',
// 	)
// 		.then((res) => res.json())
// 		.then(({ name, main, weather }) => {
// 			setCity(name);
// setTemperature(Math.round(main.temp));
// setWeather(weather[0].description);
// 		});
// }, []);

// return (
// 	<div>
// 		<div>
// 			<div>Блог веб-разработчика</div>
// 			<div>web@developer.ru</div>
// 		</div>
// 		<div>
// 			<div>
// 				{city},{' '}
// 				{new Date().toLocaleString('ru', { day: 'numeric', month: 'long' })}
// 			</div>
// 			<div>{/* {temperature} градусов, {weather} */}</div>
// 		</div>
// 	</div>
// );
// };
