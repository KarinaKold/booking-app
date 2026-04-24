import type { ComponentProps } from 'react';
import styles from './Button.module.css';

export const Button = ({ children, ...props }: ComponentProps<'button'>) => {
	return (
		<button className={styles.button} {...props}>
			{children}
		</button>
	);
};
