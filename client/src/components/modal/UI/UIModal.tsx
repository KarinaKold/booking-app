import style from './UIModal.module.css';
import { createPortal } from 'react-dom';

export const UIModal = ({ isOpen, onClose, children }) => {
	const handleClick = (e) => {
		onClose();
	};

	if (!isOpen) {
		return null;
	}

	const modal = (
		<div className={style.modalOverlay}>
			<div className={style.modalContent}>{children}</div>
			<button onClick={handleClick} className={style.buttonClose}>
				X
			</button>
		</div>
	);

	return createPortal(modal, document.getElementById('modal'));
};

UIModal.Header = function ({ children, className }) {
	return <header className={className}>{children}</header>;
};
UIModal.Body = function ({ children, className }) {
	return <div className={className}>{children}</div>;
};
UIModal.Footer = function ({ children, className }) {
	return <footer className={className}>{children}</footer>;
};
