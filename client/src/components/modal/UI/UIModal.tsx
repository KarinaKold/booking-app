import type { JSX, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { ModalCloseButton } from '../../shared/buttons';

interface SubComponentProps {
	children: ReactNode;
	className?: string;
}

interface UIModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

interface UIModalComponent {
	(props: UIModalProps): JSX.Element | null;
	Header: (props: SubComponentProps) => JSX.Element;
	Body: (props: SubComponentProps) => JSX.Element;
	Footer: (props: SubComponentProps) => JSX.Element;
}

export const UIModal: UIModalComponent = ({ isOpen, onClose, children }) => {
	const handleClick = () => {
		onClose();
	};

	if (!isOpen) {
		return null;
	}

	const modalRoot = document.getElementById('modal') as HTMLElement;

	const modal = (
		<Overlay>
			<Content>{children}</Content>
			<ModalCloseButton onClick={handleClick} />
		</Overlay>
	);

	return createPortal(modal, modalRoot);
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

const fadeIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.4);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2000;
	backdrop-filter: blur(4px);
`;

const Content = styled.div`
	background: #ffffff;
	width: 100%;
	max-width: 450px;
	padding: 30px;
	border-radius: 25px;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
	position: relative;
	animation: ${fadeIn} 0.3s ease-out;
`;
